async function verifyProductionFix() {
    const apiUrl = "http://localhost:3000/api/freepik";
    const prompt = "watercolor floral corner arrangement with pink roses, isolated on white background, high quality";
    
    console.log("Testing Production API Fix...");
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, autoRemove: true })
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    
    if (data.isTransparent) {
        console.log("✅ SUCCESS: Background removal applied via polling!");
    } else {
        console.error("❌ FAILURE: Background removal not applied.");
    }
}

verifyProductionFix();
