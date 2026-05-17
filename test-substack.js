const email = "test@example.com";
const pubName = "apexweb3";

async function test() {
  const endpoint = `https://${pubName}.substack.com/api/v1/free`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}

test();
