const categoriesContainer = document.getElementById("categories-container");
const videosContainer = document.getElementById("videos-container");
const sortByViewBtn = document.getElementById("sort-by-view");

categories = [];
let videos = [];

sortByViewBtn.addEventListener("click", () => {
	videos = videos.sort((video1, video2) => {
		return viewsNumber(video2.others.views) - viewsNumber(video1.others.views);
	});
	renderVideos();
});

const setCategory = (category_id) => {
	const categoryBtn = document.getElementById(category_id);
	if (!categoryBtn) return;
	categoriesContainer.childNodes.forEach((otherCategoryBtn) => {
		otherCategoryBtn.classList.remove("active");
	});
	categoryBtn.classList.add("active");
	videosContainer.innerHTML = ``;
	fetch(`https://openapi.programming-hero.com/api/videos/category/${category_id}`)
		.then((res) => res.json())
		.then((data) => {
			videos = data?.data || [];
			renderVideos();
		})
		.catch(console.log);
};

const timeString = (time) => {
	const timeNumber = parseInt(time);
	let [years, months, days, hours, minutes, seconds] = [0, 0, 0, 0, 0, 0];
	if (timeNumber > 0) seconds = timeNumber;
	if (seconds >= 60) {
		minutes = Math.floor(seconds / 60);
		seconds %= 60;
	}
	if (minutes >= 60) {
		hours = Math.floor(minutes / 60);
		minutes %= 60;
	}
	if (hours >= 24) {
		days = Math.floor(hours / 24);
		hours %= 24;
	}
	if (days >= 30) {
		months = Math.floor(days / 30);
		days %= 30;
	}
	if (months >= 12) {
		years = Math.floor(months / 12);
		months %= 12;
	}
	const arr = [];
	if (years) arr.push(`${years} years`);
	if (months) arr.push(`${months} months`);
	if (days) arr.push(`${days} days`);
	if (hours) arr.push(`${hours} hours`);
	if (minutes) arr.push(`${minutes} minutes`);
	if (seconds) arr.push(`${seconds} seconds`);
	return arr.join(" ");
};

const viewsNumber = (views) => {
	let num = 0;
	const lastChar = views[views.length - 1]?.toUpperCase();

	if (isNaN(lastChar)) {
		num = Number(views.slice(0, views.length - 1));
		if (lastChar === "K") num *= 1000;
		else if (lastChar === "M") num *= 1000000;
		else if (lastChar === "B") num *= 1000000000;
	} else {
		num = Number(views);
	}

	return num;
};

const renderVideos = () => {
	if (!videos.length) {
		videosContainer.innerHTML = `
                <div class="min-h-[50vh] flex flex-col gap-8 items-center justify-center"> 
                <img src="./assets/no-video.png" alt="no-video" />
                <h3 class="max-w-[400px] text-center text-2xl sm:text-4xl font-semibold text-[#171717]/30"> Oops!! Sorry, There is no content here </h3>
                </div>
            `;
	} else {
		videosContainer.innerHTML = ``;
		videos.forEach((video) => {
			const { title, thumbnail, authors, others } = video;
			const { profile_picture, profile_name, verified } = authors[0];
			const { views, posted_date } = others;

			const vidEl = document.createElement("div");
			vidEl.innerHTML = `
                <div class="w-[280px] h-[180px] relative">
                    <img class="w-full h-full rounded-lg" src="${thumbnail}" alt="..." />
                    <small class="${
											posted_date > 0 ? "inline" : "hidden"
										} absolute bottom-2 right-2 text-[11px] bg-[#171717] py-1 px-1.5 rounded-sm text-white">
                        ${timeString(posted_date)} ago
                    </small>
                </div>
                <div class="flex gap-3 pt-4">
                    <img class="w-10 h-10 rounded-full" src="${profile_picture}" alt="..." />
                    <div> 
                        <h3 class="text-lg font-semibold text-[#171717]"> ${title} </h3>
                        <h4 class="text-[#171717]/70 flex items-center gap-2">  
                            <span> ${profile_name} </span>
                            <img class="${verified ? "block" : "hidden"} w-5 h-5" src="./assets/verified.png" alt="verified-badge" />
                        </h4>
                        <p  class="text-[#171717]/70"> ${views} views </p>
                    </div>
                </div>
            `;
			videosContainer.appendChild(vidEl);
		});
	}
};

const renderCategories = () => {
	categories.forEach(({ category, category_id }) => {
		const categoryBtn = document.createElement("button");
		categoryBtn.innerText = category;
		categoryBtn.setAttribute("id", category_id);
		categoryBtn.classList.add("button");
		categoryBtn.addEventListener("click", () => {
			setCategory(category_id);
		});
		categoriesContainer.appendChild(categoryBtn);
	});
};

fetch(`https://openapi.programming-hero.com/api/videos/categories`)
	.then((res) => res.json())
	.then((data) => {
		categoriesContainer.innerHTML = ``;
		categories = data?.data || [];
		renderCategories();
		setCategory(categories?.[0]?.category_id);
	})
	.catch(console.log);
