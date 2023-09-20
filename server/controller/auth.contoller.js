const { session } = require('../config/db')

module.exports = {

    register: async (req, res) => {

        const { name, username, roles, password } = req.body

        const isExsist = await session.run('MATCH (u:User {username:$username}) RETURN u', { username })
        if (isExsist.records.length === 1) {
            res.status(401).json({
                status: 'failed',
                message: 'Username already exsist',
                user: null,
            });
        }
        const result = await session.run(
            'CREATE (u: User{ name: $name, username: $username, password: $password, roles:$roles}) RETURN u',
            { name, password, roles, username }
        )
        if (result.records.length === 1) {
            res.send({ status: 'success', messgae: "Account Created Succesefully", response: resp })
        }
        res.send({ status: 'failed', messgae: "Failed to create account", response: null })


    },

    login: async (req, res) => {
        try {
            const authHeader = req.body.headers.Authorization.split(' ');
            const credentials = Buffer.from(authHeader[1], 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');

            const result = await session.run(
                'MATCH (u:User {username: $username, password: $password}) RETURN u',
                { username, password }
            );

            if (result.records.length === 1) {
                const user = result.records[0].get('u').properties;
                res.status(200).json({
                    status: 'success',
                    message: 'Successfully logged in',
                    user: user,
                });
            } else {
                res.status(401).json({
                    status: 'failed',
                    message: 'Invalid credentials',
                    user: null,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                user: null,
            });
        }
    }
}