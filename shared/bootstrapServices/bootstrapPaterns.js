
function blocPattern() {
    // let output = '';
    let blocPattern = `
        <div class="card shadow-sm  border border-1 bloc" >
           <div class="card-body p-2 mb-4 ">
                <div class="card-title bloc-title">
                    <div class="d-flex  justify-content-between " style="margin-top:0px" >
                        <span class="fs-5 " style="color:#8B2331" ><i class="bi bi-person"></i> Customer Identity</span>

                        <div class="col-8 flex float-right text-end bloc-menu" style="cursor: pointer">            
                        </div>
                    </div>
                    <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />
                </div>    

                <div class="card-title bloc-body">  
                </div>
            </div>
        </div>`;


    let simpleFieldPattern = `if (fieldValue !== null && fieldValue !== "")
        this.innerHTML = `< div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : ${ fieldValue }</div > `;
    else
        this.innerHTML = `< div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : </div > `;


    return output;
    // document.querySelector("#customerIdentity").innerHTML = output;
}