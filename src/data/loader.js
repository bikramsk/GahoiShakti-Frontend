import qs from "qs";
// import { getStrapiURL } from "../lib/utils";


const baseUrl = "https://admin.gahoishakti.in";

export async function fetchData(url, authToken) {
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    if (!response.ok) throw new Error("Failed to fetch data");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } 
}

// Fetch data
export async function getLoginPageData() {
  const url = new URL("api/login-pages", baseUrl);
  url.search = qs.stringify({
    populate: {
        logo: {
          fields: ["url"] 
        }     
      },
  });


  return await fetchData(url.href);
}

// Fetch about us page data
export async function getAboutUsPageData() {
  const url = new URL("api/about", baseUrl);
  url.search = qs.stringify({
    populate: {
        content: {
          fields: ["text"] 
        }     
      },
  });

  return await fetchData(url.href);
}


// Fetch latest news
export async function getLatestNews() {
  const url = new URL("api/latest-news-items", baseUrl);
  url.search = qs.stringify({
    populate: ["Title", "Description", "Images"]
  });
  return await fetchData(url.href);
}

// Fetch banner images
export async function getBannerImages() {
  const url = new URL("api/banner-images", baseUrl);
  url.search = qs.stringify({
    populate: "*",
    filters: {
      isActive: {
        $eq: true
      }
    },
    sort: ["order:asc"]
  });
  return await fetchData(url.href);
}

// Fetch supported students
export async function getSupportedStudents() {
  const url = new URL("api/supported-students", baseUrl);
  url.search = qs.stringify({
    populate: "*"
  });
  return await fetchData(url.href);
}

  