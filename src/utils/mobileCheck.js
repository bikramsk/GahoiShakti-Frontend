const baseUrl = "https://admin.gahoishakti.in"; 


export async function checkMobile(mobile) {
  const url = `${baseUrl}/api/mobile-check`;
  console.log("Calling mobile-check URL:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile }),
  });

  const text = await response.text();
  let json;

  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON response:", text);
    throw new Error("Invalid JSON response from server");
  }

  return json;
}
