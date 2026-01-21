// Events JavaScript

let currentUser = null;
let events = [];
let communities = [];

document.addEventListener('DOMContentLoaded', async function() {
    currentUser = await requireAuth();
    if (!currentUser) return;

    await loadCommunities();
    await loadEvents();

    // Create event form
    const createForm = document.getElementById('createEventForm');
    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(createForm);
            await createEvent(formData);
        });
    }
});

async function loadCommunities() {
    try {
        const response = await fetch('api/communities.php?action=get_all');
        const data = await response.json();
        if (data.success) {
            communities = data.data;
            populateCommunitySelect();
        }
    } catch (error) {
        console.error('Error loading communities:', error);
    }
}

function populateCommunitySelect() {
    const select = document.getElementById('eventCommunity');
    if (select) {
        select.innerHTML = '<option value="">None</option>' + 
            communities.map(comm => `<option value="${comm.id}">${comm.name}</option>`).join('');
    }
}

async function loadEvents() {
    try {
        const response = await fetch('api/events.php?action=get_all');
        const data = await response.json();
        if (data.success) {
            events = data.data;
            displayEvents();
        }
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('eventsList').innerHTML = '<p>Error loading events</p>';
    }
}

function displayEvents() {
    const container = document.getElementById('eventsList');
    if (events.length === 0) {
        container.innerHTML = '<p>No events found. Create one to get started!</p>';
        return;
    }

    container.innerHTML = events.map(event => {
        const eventDate = new Date(event.event_date);
        const isPast = eventDate < new Date();
        
        return `
        <div class="card ${isPast ? 'card-past' : ''}">
            <div class="card-header">
                <h3>${event.title}</h3>
                <span class="badge badge-${isPast ? 'past' : 'upcoming'}">${isPast ? 'Past' : 'Upcoming'}</span>
            </div>
            <div class="card-body">
                <p>${event.description}</p>
                <div class="card-meta">
                    <span>📅 ${eventDate.toLocaleString()}</span>
                    ${event.location ? `<span>📍 ${event.location}</span>` : ''}
                    <span>👥 ${event.attendee_count} attendees</span>
                    ${event.community_name ? `<span>📁 ${event.community_name}</span>` : ''}
                </div>
            </div>
            <div class="card-footer">
                ${!isPast ? 
                    (event.is_attending ? 
                        `<button class="btn btn-secondary" onclick="updateAttendance(${event.id}, 'not_going')">Cancel</button>` :
                        `<button class="btn btn-primary" onclick="updateAttendance(${event.id}, 'going')">Attend</button>`
                    ) : ''
                }
                <button class="btn btn-outline" onclick="viewEvent(${event.id})">View</button>
            </div>
        </div>
    `;
    }).join('');
}

async function updateAttendance(eventId, status) {
    try {
        const formData = new FormData();
        formData.append('action', 'attend');
        formData.append('event_id', eventId);
        formData.append('status', status);

        const response = await fetch('api/events.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert(status === 'going' ? 'You are now attending this event!' : 'Attendance cancelled.');
            await loadEvents();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error updating attendance: ' + error.message);
    }
}

async function createEvent(formData) {
    formData.append('action', 'create');
    
    try {
        const response = await fetch('api/events.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Event created successfully!');
            closeCreateModal();
            document.getElementById('createEventForm').reset();
            await loadEvents();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error creating event: ' + error.message);
    }
}

function showCreateModal() {
    document.getElementById('createModal').classList.add('show');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('show');
}

function viewEvent(id) {
    // You can implement a detailed view page here
    alert('Event details for ID: ' + id);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('createModal');
    if (event.target == modal) {
        closeCreateModal();
    }
});

