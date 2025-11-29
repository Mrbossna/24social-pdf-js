const endpoint = "https://api24.24aff.in.th";

document.addEventListener("DOMContentLoaded", () => {
    const username = document
        .querySelector("h2.totals-block__count-value.style-text-primary")
        ?.textContent.trim()
        .replace(/"/g, "");

    const table = document.querySelector(".table");

    if (!table) return;

    // -------------------------------
    // 1) เพิ่มหัวคอลัมน์ Download
    // -------------------------------
    const theadRow = table.querySelector("thead tr");
    const th = document.createElement("th");
    th.textContent = "Download";
    theadRow.appendChild(th);

    // -------------------------------
    // 2) เพิ่มปุ่ม Download ในแต่ละแถว
    // -------------------------------
    const rows = table.querySelectorAll("tbody tr");
    let result = ''

    rows.forEach((row) => {
        const emptyTd = document.createElement("td");
        emptyTd.classList.add("download-cell");
        emptyTd.innerHTML = ""; // ยังไม่ใส่อะไร
        row.appendChild(emptyTd);
    });


    const codes = Array.from(rows).map(row => {
        return Number(row.querySelector("td").textContent.trim());
    });
    result = codes;

    checkSlip(username, result);
});

async function checkSlip(username, codes) {
    try {
        const url = new URL(endpoint + "/order/get-document-share");
        const table = document.querySelector(".table");
        const rows = table.querySelectorAll("tbody tr");

        const data = {
            payment_ids: codes,
            username: username,
        }

        fetch(url.toString(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                const response = await res.json();
                const validIds = response.data;

                rows.forEach((row) => {
                    const id = Number(row.querySelector("td").textContent.trim());
                    const downloadCell = row.querySelector(".download-cell");

                    if (validIds.includes(id)) {
                        downloadCell.innerHTML = `
                            <span class="download-btn" data-id="${id}" style="cursor:pointer;">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2" 
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    style="vertical-align: middle;"
                                >
                                    <!-- ขยับลูกศรลง -->
                                    <g transform="translate(0, 5)">
                                        <path d="M11 14V4m0 0l-4 4m4-4l4 4" />
                                    </g>
                                    <path d="M20 16.58A5 5 0 0 0 18 9h-1.26a8 8 0 1 0-11.58 9.35" />
                                </svg>
                            </span>
                        `;
                    } else {
                        downloadCell.innerHTML = "";
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });

        // -------------------------------
        // 3) Event: คลิกปุ่ม Download
        // -------------------------------
        table.addEventListener("click", (e) => {
            const btn = e.target.closest(".download-btn");

            if (btn) {
                const id = btn.dataset.id;
                downloadFileById(username, id);
            }
        });
    } catch (error) {
        console.error('Error checking slip:', error);
        return null;
    }
}

// ฟังก์ชันจำลองการดาวน์โหลด
function downloadFileById(username, id) {
    try {
        const url = new URL(endpoint + "/order/link-document-share");
        const data = {
            payment_id: Number(id),
            username: username,
        }

        fetch(url.toString(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                const response = await res.json();
                window.open(response.data, '_blank');
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });


    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
