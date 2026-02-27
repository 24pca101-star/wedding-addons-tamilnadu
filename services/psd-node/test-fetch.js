async function testFetch() {
    try {
        const response = await fetch('http://localhost:5002/preview/design-3.png');
        console.log(`Status: ${response.status}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);
        const blob = await response.blob();
        console.log(`Size: ${blob.size} bytes`);
    } catch (err) {
        console.error(`Fetch Error: ${err.message}`);
    }
}

testFetch();
