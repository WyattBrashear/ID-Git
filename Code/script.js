var clickedCount = 0;
var goal = 10;
function onClicked() {
    clickedCount += 1;
    console.log("Button has been clicked " + clickedCount + " times!");
    if (clickedCount >= goal) {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
    alert("You have clicked the button " + clickedCount + " times!");
}

function onStart() {
    goal = prompt("Enter a random funny number!");
}