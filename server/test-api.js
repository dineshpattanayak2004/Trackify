import http from "http";

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/orders",
  method: "GET",
  headers: {
    "Authorization": "Bearer test-token",
  },
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data);
    if (res.statusCode === 401) {
      console.log("\n✓ API is responding (401 = unauthorized, which is expected without valid token)");
    } else if (res.statusCode === 200) {
      console.log("\n✓ Orders fetched successfully!");
      try {
        const orders = JSON.parse(data);
        console.log(`  Found ${orders.length} orders`);
      } catch (e) {
        console.log("  Response:", data);
      }
    } else {
      console.log("\n✗ Unexpected response");
    }
    process.exit(0);
  });
});

req.on("error", (err) => {
  console.error("Error:", err.message);
  console.log("\n✗ Server might not be running on port 4000");
  process.exit(1);
});

req.end();