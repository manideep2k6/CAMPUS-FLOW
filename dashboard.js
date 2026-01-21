// Dashboard JavaScript

let currentUser = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    currentUser = await requireAuth();
    if (!currentUser) return;

    // Display user name
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.first_name || currentUser.username;
    }

    // Load dashboard data
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        const response = await fetch('api/dashboard.php');
        const data = await response.json();
        if (data.success) {
            displayMyCommunities(data.data.communities);
            displayMyProjects(data.data.projects);
            displayUpcomingEvents(data.data.events);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        document.getElementById('myCommunities').innerHTML = '<p>Error loading data</p>';
        document.getElementById('myProjects').innerHTML = '<p>Error loading data</p>';
        document.getElementById('upcomingEvents').innerHTML = '<p>Error loading data</p>';
    }
}

function displayMyCommunities(communities) {
    const container = document.getElementById('myCommunities');
    const limited = communities.slice(0, 3);
    if (limited.length === 0) {
        container.innerHTML = '<p>You are not part of any communities yet.</p>';
    } else {
        container.innerHTML = limited.map(comm => `
            <div class="list-item">
                <h4>${comm.name}</h4>
                <p>${comm.member_count} members</p>
            </div>
        `).join('');
    }
}

function displayMyProjects(projects) {
    const container = document.getElementById('myProjects');
    const limited = projects.slice(0, 3);
    if (limited.length === 0) {
        container.innerHTML = '<p>You are not part of any projects yet.</p>';
    } else {
        container.innerHTML = limited.map(project => `
            <div class="list-item">
                <h4>${project.title}</h4>
                <p>${project.status} • ${project.member_count} members</p>
            </div>
        `).join('');
    }
}

function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEvents');
    const limited = events.slice(0, 3);
    if (limited.length === 0) {
        container.innerHTML = '<p>No upcoming events.</p>';
    } else {
        container.innerHTML = limited.map(event => {
            const eventDate = new Date(event.event_date);
            return `
                <div class="list-item">
                    <h4>${event.title}</h4>
                    <p>${eventDate.toLocaleDateString()} • ${event.attendee_count} attendees</p>
                </div>
            `;
        }).join('');
    }
}

