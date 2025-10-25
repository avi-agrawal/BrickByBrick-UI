// Test script for the new Topic-Subtopic system
const { User, Roadmap, Topic, Subtopic, sequelize } = require('./server/src/models');

async function testTopicSubtopicSystem() {
    try {
        console.log('🧪 Testing new Topic-Subtopic system...\n');

        // Create a test user
        const user = await User.create({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'hashedpassword',
            authProvider: 'local'
        });
        console.log('✅ Created test user:', user.email);

        // Create a test roadmap
        const roadmap = await Roadmap.create({
            title: 'Data Structures & Algorithms',
            description: 'Complete learning path for DSA',
            color: '#3B82F6',
            userId: user.id
        });
        console.log('✅ Created roadmap:', roadmap.title);

        // Create topics
        const topic1 = await Topic.create({
            title: 'Arrays',
            description: 'Understanding array data structures',
            order: 1,
            roadmapId: roadmap.id
        });
        console.log('✅ Created topic:', topic1.title);

        const topic2 = await Topic.create({
            title: 'Graphs',
            description: 'Graph algorithms and traversal',
            order: 2,
            roadmapId: roadmap.id
        });
        console.log('✅ Created topic:', topic2.title);

        // Create subtopics for Arrays
        const subtopic1 = await Subtopic.create({
            title: 'Two Pointers',
            description: 'Technique for solving array problems',
            order: 1,
            topicId: topic1.id,
            difficulty: 'intermediate',
            estimatedTime: 45
        });
        console.log('✅ Created subtopic:', subtopic1.title);

        const subtopic2 = await Subtopic.create({
            title: 'Sliding Window',
            description: 'Efficient subarray problems',
            order: 2,
            topicId: topic1.id,
            difficulty: 'advanced',
            estimatedTime: 60
        });
        console.log('✅ Created subtopic:', subtopic2.title);

        // Create subtopics for Graphs
        const subtopic3 = await Subtopic.create({
            title: 'BFS',
            description: 'Breadth-First Search traversal',
            order: 1,
            topicId: topic2.id,
            difficulty: 'beginner',
            estimatedTime: 30
        });
        console.log('✅ Created subtopic:', subtopic3.title);

        // Test completion
        await subtopic1.update({ isCompleted: true, completedDate: new Date().toISOString().split('T')[0] });
        console.log('✅ Marked subtopic as completed:', subtopic1.title);

        // Test progress calculation
        const totalSubtopics = await Subtopic.count({ where: { topicId: topic1.id } });
        const completedSubtopics = await Subtopic.count({
            where: { topicId: topic1.id, isCompleted: true }
        });

        await topic1.update({ totalSubtopics, completedSubtopics });
        console.log(`✅ Updated topic progress: ${completedSubtopics}/${totalSubtopics} subtopics`);

        // Test fetching with associations
        const roadmapWithData = await Roadmap.findByPk(roadmap.id, {
            include: [
                {
                    model: Topic,
                    as: 'topics',
                    include: [
                        {
                            model: Subtopic,
                            as: 'subtopics',
                            order: [['order', 'ASC']]
                        }
                    ],
                    order: [['order', 'ASC']]
                }
            ]
        });

        console.log('\n📊 Final roadmap structure:');
        console.log(`Roadmap: ${roadmapWithData.title}`);
        console.log(`Topics: ${roadmapWithData.topics.length}`);

        roadmapWithData.topics.forEach(topic => {
            console.log(`  📚 ${topic.title} (${topic.completedSubtopics}/${topic.totalSubtopics} subtopics)`);
            topic.subtopics.forEach(subtopic => {
                const status = subtopic.isCompleted ? '✅' : '⏳';
                console.log(`    ${status} ${subtopic.title} (${subtopic.difficulty}, ${subtopic.estimatedTime}min)`);
            });
        });

        console.log('\n🎉 All tests passed! The new Topic-Subtopic system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testTopicSubtopicSystem();
