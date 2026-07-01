/**
 * KiyaOS - Cloudflare Worker
 * Handles API requests and simulated backend logic.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle Contact Form Submission
    if (url.pathname === "/api/contact" && request.method === "POST") {
      try {
        const body = await request.json();
        // Here you would typically send an email or save to a database
        console.log("New message from:", body.email);
        
        return new Response(JSON.stringify({ success: true, message: "Message sent to Avid Kiya." }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response("Invalid Request", { status: 400 });
      }
    }

    // Default: Forward to static assets (handled by CF Pages automatically, 
    // but this script can act as a standalone worker if needed)
    return new Response("Kiya OS Worker is Active", { status: 200 });
  },
};
