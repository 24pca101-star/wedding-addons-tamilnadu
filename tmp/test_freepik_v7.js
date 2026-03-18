async function testAsyncSequence() {
    const apiKey = "FPSX96aea39515f4c4ea8ef8784d1c1338fd";
    const prompt = "watercolor floral corner arrangement with pink roses, isolated on white background, high quality";
    
    console.log("1. Generating Image (Async)...");
    const genResponse = await fetch("https://api.freepik.com/v1/ai/mystic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-freepik-api-key": apiKey
        },
        body: JSON.stringify({ prompt, num_images: 1 })
    });

    const genData = await genResponse.json();
    if (!genResponse.ok) {
        console.error("Async Generation Failed:", genData);
        return;
    }

    const taskId = genData.data.task_id;
    console.log("Task ID:", taskId);

    // 2. Polling for result
    let imageUrl = null;
    for (let i = 0; i < 20; i++) {
        console.log(`Polling task ${taskId}... (${i+1}/20)`);
        const taskResponse = await fetch(`https://api.freepik.com/v1/ai/tasks/${taskId}`, {
            headers: { "x-freepik-api-key": apiKey }
        });
        const taskData = await taskResponse.json();
        
        if (taskData.data && taskData.data.status === "COMPLETED") {
            imageUrl = taskData.data.generated[0].url;
            break;
        } else if (taskData.data && taskData.data.status === "ERROR") {
            console.error("Task failed:", taskData.data.error);
            break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!imageUrl) {
        console.error("Failed to get image URL from task.");
        return;
    }

    console.log("Extracted Image URL:", imageUrl);

    console.log("3. Removing Background...");
    const removeBgResponse = await fetch("https://api.freepik.com/v1/ai/beta/remove-background", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-freepik-api-key": apiKey,
            "Accept": "application/json"
        },
        body: new URLSearchParams({ image_url: imageUrl }).toString()
    });

    const bgData = await removeBgResponse.json();
    console.log("BG Removal Status:", removeBgResponse.status);
    console.log("BG Removal Response:", JSON.stringify(bgData, null, 2));
}

testAsyncSequence();
