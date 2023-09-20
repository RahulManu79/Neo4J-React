



module.exports = (req, res, next) => {
    if (!req.body.headers.Authorization) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Extract and decode the Basic Authentication header
    const authHeader = req.body.headers.Authorization.split(' ');
    if (authHeader[0] !== 'Basic') {
        return res.status(401).json({ error: 'Invalid authentication method' });
    }

    const credentials = Buffer.from(authHeader[1], 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Check the username and password (replace with your authentication logic)
    if (username  && password ) {
        req.user = { username };
        next(); // Continue to the next middleware or route handler
    } else {
        // Authentication failed
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

