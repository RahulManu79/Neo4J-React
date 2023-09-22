const { session } = require('../config/db')


module.exports = {
    getCourses: async (req, res) => {
        try {
            const result = await session.run(
                'MATCH (l:Lesson)-[:BELONGS_TO]->(c:Course) RETURN c, collect(l) AS lessons'
            );
            const courses = result.records.map(record => {
                const courseNode = record.get('c');
                const lessonNodes = record.get('lessons').map(lessonNode => ({
                    id: lessonNode.identity.low,
                    identifier: lessonNode.properties.identifier,
                    title: lessonNode.properties.title,
                }));

                return {
                    id: courseNode.identity.low,
                    identifier: courseNode.properties.identifier,
                    title: courseNode.properties.title,
                    teacher: courseNode.properties.teacher,
                    lessons: lessonNodes,
                };
            });
            res.status(200).json({
                status: 'success',
                courses: courses,
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                courses: [],
            });
        }
    },

    viewCourse: async (req, res) => {
        const { id } = req.params

        const result = await session.run("MATCH (l:Lesson)-[:BELONGS_TO]->(c:Course {identifier: $id}) RETURN c, COLLECT(l) AS lessons;", { id })
        const courses = result.records.map(record => {
            const courseNode = record.get('c');
            const lessonNodes = record.get('lessons').map(lessonNode => ({
                id: lessonNode.identity.low,
                identifier: lessonNode.properties.identifier,
                title: lessonNode.properties.title,
            }));

            return {
                id: courseNode.identity.low,
                identifier: courseNode.properties.identifier,
                title: courseNode.properties.title,
                teacher: courseNode.properties.teacher,
                lessons: lessonNodes,
            };
        });
        res.status(200).json({
            status: 'success',
            courses: courses,
        });
    },

    enrollCourse: async (req, res) => {

        const { courseIdentifier, username } = req.body

        await session.run("MATCH (u:User {username: $username}), (c:Course {identifier: $courseIdentifier })CREATE(u) - [: ENROLLED_IN] -> (c) RETURN u,c",
            { username, courseIdentifier }
        ).then((result) => {
            res.status(200).json({
                status: 'success',
            });
        }).catch((e) => {
            throw e
        })

    },

    enrolledCourses: async (req, res) => {
        const { username } = req.params;

        const result = await session.run(
            "MATCH (u:User { username: $username })-[:ENROLLED_IN]->(c:Course) OPTIONAL MATCH (l:Lesson)-[:BELONGS_TO]->(c) RETURN c, COLLECT(DISTINCT l) AS lessons;",
            { username }
        );

        const courses = result.records.map(record => {
            const courseNode = record.get('c');
            const lessonNodes = record.get('lessons').map(lessonNode => ({
                id: lessonNode.identity.low,
                identifier: lessonNode.properties.identifier,
                title: lessonNode.properties.title,
            }));

            return {
                id: courseNode.identity.low,
                identifier: courseNode.properties.identifier,
                title: courseNode.properties.title,
                teacher: courseNode.properties.teacher,
                lessons: lessonNodes,
            };
        });

        res.status(200).json({
            status: 'success',
            courses: courses,
        });
    }

}