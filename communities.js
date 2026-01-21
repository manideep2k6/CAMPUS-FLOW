// Communities JavaScript

let currentUser = null;
let communities = [];

document.addEventListener('DOMContentLoaded', async function() {
    currentUser = await requireAuth();
    if (!currentUser) return;

    await loadCommunities();

    // Create community form
    const createForm = document.getElementById('createCommunityForm');
    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(createForm);
            await createCommunity(formData);
        });
    }
});

async function loadCommunities() {
    try {
        const response = await fetch('api/communities.php?action=get_all');
        const data = await response.json();
        if (data.success) {
            communities = data.data;
            displayCommunities();
        }
    } catch (error) {
        console.error('Error loading communities:', error);
        document.getElementById('communitiesList').innerHTML = '<p>Error loading communities</p>';
    }
}

function displayCommunities() {
    const container = document.getElementById('communitiesList');
    if (communities.length === 0) {
        container.innerHTML = '<p>No communities found. Create one to get started!</p>';
        return;
    }

    container.innerHTML = communities.map(comm => `
        <div class="card">
            <div class="card-header">
                <h3>${comm.name}</h3>
            </div>
            <div class="card-body">
                <p>${comm.description}</p>
                <div class="card-meta">
                    <span>👥 ${comm.member_count} members</span>
                    <span>Created by ${comm.creator_name}</span>
                </div>
            </div>
            <div class="card-footer">
                ${comm.is_member ? 
                    `<button class="btn btn-secondary" onclick="leaveCommunity(${comm.id})">Leave</button>` :
                    `<button class="btn btn-primary" onclick="joinCommunity(${comm.id})">Join</button>`
                }
                <button class="btn btn-outline" onclick="viewCommunity(${comm.id})">View</button>
            </div>
        </div>
    `).join('');
}

async function joinCommunity(communityId) {
    try {
        const formData = new FormData();
        formData.append('action', 'join');
        formData.append('community_id', communityId);

        const response = await fetch('api/communities.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Joined community successfully!');
            await loadCommunities();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error joining community: ' + error.message);
    }
}

async function leaveCommunity(communityId) {
    if (!confirm('Are you sure you want to leave this community?')) return;

    try {
        const formData = new FormData();
        formData.append('action', 'leave');
        formData.append('community_id', communityId);

        const response = await fetch('api/communities.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Left community successfully!');
            await loadCommunities();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error leaving community: ' + error.message);
    }
}

async function createCommunity(formData) {
    try {
        const response = await fetch('api/communities.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Community created successfully!');
            closeCreateModal();
            document.getElementById('createCommunityForm').reset();
            await loadCommunities();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error creating community: ' + error.message);
    }
}

function showCreateModal() {
    document.getElementById('createModal').classList.add('show');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('show');
}

function viewCommunity(id) {
    // You can implement a detailed view page here
    alert('Community details for ID: ' + id);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('createModal');
    if (event.target == modal) {
        closeCreateModal();
    }
});

