document.addEventListener('DOMContentLoaded', () => {
    const userIdInput = document.getElementById('friend-handle');
    const userList = document.getElementById('friend-list');
    const contestList = document.getElementById('contest-list');
    const statusIcon = document.getElementById('statusIcon');
    const addFriendBtn = document.getElementById('add-friend');
    const msg = document.getElementById('message');
    const timeframeSelect = document.getElementById('timeframe');
    const problemsTab = document.getElementById('problems-tab');
    const contestsTab = document.getElementById('contests-tab');
    const settingsTab = document.getElementById('settings-tab');
    const problemsContent = document.getElementById('problems-content');
    const contestsContent = document.getElementById('contests-content');
    const settingsContent = document.getElementById('settings-content');

    userIdInput.addEventListener('input', checkUser);
    addFriendBtn.addEventListener('click', addUser);
    timeframeSelect.addEventListener('change', loadFriends);
    timeframeSelect.addEventListener('change', loadContestSubmissions);
    problemsTab.addEventListener('click', () => switchTab('problems'));
    contestsTab.addEventListener('click', () => switchTab('contests'));
    settingsTab.addEventListener('click', () => switchTab('settings'));

    async function checkUser() {
        const userId = userIdInput.value.trim();

        if (userId === '') {
            statusIcon.className = '';
            return;
        }

        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${userId}`);
            const data = await response.json();

            statusIcon.className = (data.status === 'OK' && data.result.length > 0) ? 'valid' : 'invalid';
        } catch (error) {
            console.error('Error fetching user:', error);
            statusIcon.className = 'invalid';
        }
    }

    async function addUser() {
        const userId = userIdInput.value.trim();

        if (userId === '') {
            msg.innerText = 'Please enter a user ID.';
            return;
        }

        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${userId}`);
            const data = await response.json();

            if (data.status === 'OK' && data.result.length > 0) {
                const user = data.result[0];

                const friends = JSON.parse(localStorage.getItem('friends')) || [];

                // Check if the user is already in the list
                const userExists = friends.some(friend => friend.handle === user.handle);

                if (userExists) {
                    msg.innerText = 'User is already in the list.';
                    return;
                }

                const solvedCount = await getSolvedCount(userId, timeframeSelect.value);

                const userData = {
                    handle: user.handle,
                    rating: user.rating || 'No rating',
                    solvedCount: solvedCount.count,
                    points: solvedCount.points
                };

                await saveFriend(userData);
                userIdInput.value = '';
                statusIcon.className = 'valid';
                msg.innerText = '';
            } else {
                msg.innerText = 'User not found';
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            msg.innerText = 'Error fetching user data';
        }
    }

    async function getSolvedCount(handle, timeframe) {
        try {
            const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
            const data = await response.json();
            if (data.status === 'OK') {
                const submissions = data.result;
                const solvedProblems = new Set();
                const now = new Date();
                let totalPoints = 0;

                submissions.forEach(submission => {
                    if (submission.verdict === 'OK') {
                        const submissionTime = new Date(submission.creationTimeSeconds * 1000);
                        let timeDifference = now - submissionTime;
                        let timeFrameMillis;

                        switch (timeframe) {
                            case '24hrs':
                                timeFrameMillis = 24 * 60 * 60 * 1000;
                                break;
                            case '1week':
                                timeFrameMillis = 7 * 24 * 60 * 60 * 1000;
                                break;
                            case '1month':
                                timeFrameMillis = 30 * 24 * 60 * 60 * 1000;
                                break;
                            case '1year':
                                timeFrameMillis = 365 * 24 * 60 * 60 * 1000;
                                break;
                            default:
                                timeFrameMillis = Infinity;
                        }

                        if (timeDifference <= timeFrameMillis) {
                            const problemId = submission.problem.contestId + '-' + submission.problem.index;
                            if (!solvedProblems.has(problemId)) {
                                solvedProblems.add(problemId);
                                totalPoints += calculatePoints(submission.problem.rating);
                            }
                        }
                    }
                });

                return { count: solvedProblems.size, points: totalPoints };
            }
        } catch (error) {
            console.error('Error fetching solved count:', error);
        }
        return { count: 'Unknown', points: 0 };
    }

    function calculatePoints(rating) {
        if (rating >= 800 && rating <= 900) return 1;
        if (rating >= 1000 && rating <= 1100) return 2;
        if (rating >= 1200 && rating <= 1300) return 3;
        if (rating >= 1400 && rating <= 1500) return 4;
        if (rating >= 1600 && rating <= 1700) return 5;
        if (rating >= 1800 && rating <= 1900) return 6;
        if (rating >= 2000 && rating <= 2100) return 7;
        if (rating >= 2200 && rating <= 2300) return 8;
        if (rating >= 2400 && rating <= 2500) return 9;
        if (rating >= 2600) return 10;
        return 0;
    }

    async function loadFriends() {
        const timeframe = timeframeSelect.value;
        const friends = JSON.parse(localStorage.getItem('friends')) || [];

        const friendsWithCounts = await Promise.all(friends.map(async (friend) => {
            const { count, points } = await getSolvedCount(friend.handle, timeframe);
            return { ...friend, solvedCount: count, points };
        }));

        friendsWithCounts.sort((a, b) => b.points - a.points);

        userList.innerHTML = '';

        friendsWithCounts.forEach(friend => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${friend.handle}</td>
                <td>${friend.solvedCount}</td>
                <td>${friend.points}</td>
                <td><button class="delete-friend" data-handle="${friend.handle}">Delete</button></td>
            `;
            userList.appendChild(row);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-friend').forEach(button => {
            button.addEventListener('click', deleteUser);
        });
    }

    async function loadContestSubmissions() {
        const friends = JSON.parse(localStorage.getItem('friends')) || [];
        contestList.innerHTML = '';

        for (const friend of friends) {
            const contestCount = await getContestCount(friend.handle);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${friend.handle}</td>
                <td>${contestCount}</td>
                <td>${friend.rating}</td>
            `;
            contestList.appendChild(row);
        }
    }

    async function getContestCount(handle) {
        try {
            const response = await fetch(`https://codeforces.com/api/user.contests?handle=${handle}`);
            const data = await response.json();

            if (data.status === 'OK') {
                const now = new Date();
                const contests = data.result;

                const timeframe = timeframeSelect.value;
                let timeFrameMillis;

                switch (timeframe) {
                    case '24hrs':
                        timeFrameMillis = 24 * 60 * 60 * 1000;
                        break;
                    case '1week':
                        timeFrameMillis = 7 * 24 * 60 * 60 * 1000;
                        break;
                    case '1month':
                        timeFrameMillis = 30 * 24 * 60 * 60 * 1000;
                        break;
                    case '1year':
                        timeFrameMillis = 365 * 24 * 60 * 60 * 1000;
                        break;
                    default:
                        timeFrameMillis = Infinity;
                }

                return contests.filter(contest => {
                    const contestTime = new Date(contest.startTimeSeconds * 1000);
                    return (now - contestTime) <= timeFrameMillis;
                }).length;
            }
        } catch (error) {
            console.error('Error fetching contest count:', error);
        }
        return 0;
    }

    async function saveFriend(userData) {
        const friends = JSON.parse(localStorage.getItem('friends')) || [];
        friends.push(userData);
        localStorage.setItem('friends', JSON.stringify(friends));
        loadFriends();
        loadContestSubmissions();
    }

    async function deleteUser(event) {
        const handle = event.target.getAttribute('data-handle');
        let friends = JSON.parse(localStorage.getItem('friends')) || [];
        friends = friends.filter(friend => friend.handle !== handle);
        localStorage.setItem('friends', JSON.stringify(friends));
        loadFriends();
        loadContestSubmissions();
    }

    function switchTab(tab) {
        problemsTab.classList.toggle('active', tab === 'problems');
        contestsTab.classList.toggle('active', tab === 'contests');
        settingsTab.classList.toggle('active', tab === 'settings');
        problemsContent.style.display = tab === 'problems' ? 'block' : 'none';
        contestsContent.style.display = tab === 'contests' ? 'block' : 'none';
        settingsContent.style.display = tab === 'settings' ? 'block' : 'none';
    }

    loadFriends();
    loadContestSubmissions();
});
