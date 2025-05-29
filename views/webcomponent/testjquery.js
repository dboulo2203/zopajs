

export function startjqueryController() {

    let myArray = [2, 3];



    let outpustring = ` <div class="col-md-10 col-lg-10 col-xl-10" >
`;
    myArray.map((Element, index) => {
        outpustring += `<span style = "cursor: pointer" class="noticeButtons" sera_id = "${Element}" >
        indide span ${Element}
            </span > 
            </br>`;

    });
    outpustring += `</div>`;
    document.querySelector("#mainActiveSection").innerHTML = outpustring;

    const cbox = document.querySelectorAll(".noticeButtons");

    for (let i = 0; i < cbox.length; i++) {
        cbox[i].addEventListener("click", function () {
            console.log(cbox[i]);
            console.log("click span" + cbox[i].attributes.getNamedItem('sera_id').value);;
        });
    }
    // 

    // $(".noticeButtons").on("click", function (event) {
    //     console.log("click span");

    // });

    document.querySelector(".noticeButtons").onclick = function (event) {
        console.log("addnewButton : ");
    };



};




