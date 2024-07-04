document.getElementById('generateButton').addEventListener('click', generateProfilePicture);

function generateProfilePicture() {
    const name = document.getElementById('nameInput').value;
    const initials = getInitials(name);
    const color = getRandomColor();

    const profilePictureElement = document.getElementById('profilePicture');
    profilePictureElement.style.backgroundColor = color;
    profilePictureElement.textContent = initials;
}

function getInitials(name) {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0][0].toUpperCase();
    }
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
}

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A2', '#33FFF6', '#F633FF'];
    return colors[Math.floor(Math.random() * colors.length)];
}
