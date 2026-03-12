const http = require('http');

http.get('http://localhost:3000/api/data?domains=Maths&categories=Conceptual', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`Status: ${parsed.status}`);
      console.log(`Filtered Data Length: ${parsed.filteredData.length}`);
      if (parsed.filteredData.length > 0) {
        console.log(`Sample Subject: ${parsed.filteredData[0].subject}`);
      }
    } catch(e) {
      console.error(e);
      console.log(data.substring(0, 100)); // Print part of raw response
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
