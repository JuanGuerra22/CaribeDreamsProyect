//Buttons redirection
function OnClickButtonClass(className, link) {
    const buttons = document.querySelectorAll(`.${className}`);

    if (document.querySelector("header")) {
        if (!buttons.length) {
            console.log(`No class ${className} was found`);
            return;
        }
        else {
            buttons.forEach((button) => {
                button.addEventListener("click", function () {
                    RedirectTo(link);
                });
            });
        }
    }

}

function RedirectTo(link) {
    console.log(`Redirecting to: ${link}`);
    window.location.href = link;
}

try {
    OnClickButtonClass("redirectToLogIn", "login.html");
    OnClickButtonClass("redirectToIndex", "index.html");
    OnClickButtonClass("redirectToAbout", "about.html");
    OnClickButtonClass("redirectToCreators", "creators.html")
} catch {
    console.error("Error setting up button that redirects", error);
}



