export function reportPost(postid) {
  // For now, just log or show a simple alert
  alert(`Reported post ID: ${postid}`);

  // Optionally send to backend
  /*
  fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postid })
  }).then(res => {
      if (res.ok) alert("Post reported.");
      else alert("Failed to report post.");
  });
  */
}


// Function to submit a report
async function submitReport(reportData) {
    const response = await fetch('/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
    });

    const result = await response.json();
    console.log(result.message);
}

// // Example usage
// const reportExample = {
//     reportedBy: "user123",
//     targetId: "comment987",
//     targetType: "comment",
//     reason: "Hate speech",
//     notes: "Contains offensive language"
// };

// submitReport(reportExample);


/*

API Endpoints
1. Submit a Report
Method: POST

URL: /report

Payload:

json
{
  "reportedBy": "user123",
  "targetId": "post567",
  "targetType": "post",
  "reason": "Spam",
  "notes": "Contains repeated ads"
}
Response:

json
{
  "message": "Report submitted"
}
2. Get All Reports (for moderation)
Method: GET

URL: /reports

Response:

json
[
  {
    "id": "abcd123",
    "reportedBy": "user123",
    "targetId": "post567",
    "targetType": "post",
    "reason": "Spam",
    "status": "pending",
    "createdAt": "2025-05-04T16:55:00Z"
  }
]
3. Update Report Status
Method: PUT

URL: /report/:id

Payload:

json
{
  "status": "resolved",
  "notes": "User warned, post removed"
}
Response:

json
{
  "message": "Report updated"
}
*/