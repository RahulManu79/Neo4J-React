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

    }
}