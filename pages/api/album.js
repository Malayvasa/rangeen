let cachedToken = null; // Variable to cache the token
let tokenExpiration = null; // Variable to track token expiration

export default async function handler(req, res) {
	const client_id = process.env.SPOTIFY_CLIENT_ID;
	const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

	if (req.method === "POST") {
		// Check if we need to fetch a new token
		if (!cachedToken || Date.now() >= tokenExpiration) {
			// Fetch a new token
			const tokenResponse = await fetch(
				"https://accounts.spotify.com/api/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Accept: "application/json",
						Authorization:
							"Basic " +
							new Buffer.from(client_id + ":" + client_secret).toString(
								"base64"
							),
					},
					body: "grant_type=client_credentials",
				}
			);

			const tokenData = await tokenResponse.json();
			cachedToken = tokenData.access_token;
			tokenExpiration = Date.now() + tokenData.expires_in * 1000; // Set expiration time
		}

		// Handle album search
		if (req.query.search === "true") {
			const { searchString } = req.body;

			let response = await fetch(
				`https://api.spotify.com/v1/search?type=album&include_external=audio&q=${searchString}`,
				{
					headers: {
						Authorization: "Bearer " + cachedToken,
						"Content-type": "application/json",
					},
				}
			);

			if (!response.ok) {
				return res
					.status(response.status)
					.json({ error: "Failed to fetch albums." });
			}

			let data = await response.json();
			return res.status(200).json(data.albums ? data.albums.items : []);
		}
	}

	return res.status(405).json({ error: "Method not allowed." });
}
