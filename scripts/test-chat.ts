async function testChat() {
  const url = 'http://localhost:3000/api/chat';
  const testMessage = "Aduh capek banget seharian ngoding bug nggak kelar-kelar, mana notifikasi slack bunyi terus bikin makin stress.";

  console.log("Sending message:", testMessage);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: testMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    console.log("Streaming response:");
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('0:')) {
            try {
                const textChunk = JSON.parse(line.slice(2));
                process.stdout.write(textChunk);
            } catch (e) {
                // ignore parsing errors for partial chunks
            }
        }
      }
    }
    console.log("\n\nDone.");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testChat();
