// Projects JavaScript

let currentUser = null;
let projects = [];
let communities = [];

document.addEventListener('DOMContentLoaded', async function() {
    currentUser = await requireAuth();
    if (!currentUser) return;

    await loadCommunities();
    await loadProjects();

    // Create project form
    const createForm = document.getElementById('createProjectForm');
    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(createForm);
            await createProject(formData);
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
    const select = document.getElementById('projectCommunity');
    if (select) {
        select.innerHTML = '<option value="">None</option>' + 
            communities.map(comm => `<option value="${comm.id}">${comm.name}</option>`).join('');
    }
}

async function loadProjects() {
    try {
        const response = await fetch('api/projects.php?action=get_all');
        const data = await response.json();
        if (data.success) {
            projects = data.data;
            displayProjects();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsList').innerHTML = '<p>Error loading projects</p>';
    }
}

function displayProjects() {
    const container = document.getElementById('projectsList');
    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found. Create one to get started!</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="card">
            <div class="card-header">
                <h3>${project.title}</h3>
                <span class="badge badge-${project.status}">${project.status}</span>
            </div>
            <div class="card-body">
                <p>${project.description}</p>
                <div class="card-meta">
                    <span>👥 ${project.member_count} members</span>
                    ${project.community_name ? `<span>📁 ${project.community_name}</span>` : ''}
                    <span>By ${project.first_name} ${project.last_name}</span>
                </div>
            </div>
            <div class="card-footer">
                ${project.is_member ? 
                    `<button class="btn btn-secondary" disabled>Member</button>` :
                    `<button class="btn btn-primary" onclick="joinProject(${project.id})">Join</button>`
                }
                <button class="btn btn-outline" onclick="viewProject(${project.id})">View</button>
            </div>
        </div>
    `).join('');
}

async function joinProject(projectId) {
    try {
        const formData = new FormData();
        formData.append('action', 'join');
        formData.append('project_id', projectId);

        const response = await fetch('api/projects.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Joined project successfully!');
            await loadProjects();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error joining project: ' + error.message);
    }
}

async function createProject(formData) {
    formData.append('action', 'create');
    
    try {
        const response = await fetch('api/projects.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Project created successfully!');
            closeCreateModal();
            document.getElementById('createProjectForm').reset();
            await loadProjects();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error creating project: ' + error.message);
    }
}

function showCreateModal() {
    document.getElementById('createModal').classList.add('show');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('show');
}

function viewProject(id) {
    // You can implement a detailed view page here
    alert('Project details for ID: ' + id);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('createModal');
    if (event.target == modal) {
        closeCreateModal();
    }
});

