(function init() {

  function buildLeftTable() {
    const leftContainer = document.querySelector('.central-table-left-container');
    const leftTableHeader = document.getElementById('central-table-header').content.cloneNode(true);
    leftContainer.appendChild(leftTableHeader);
    const centralTable = leftContainer.querySelector('#central-table');
    const leftTableRow = document.getElementById('central-table-row')
    for (let i = 1; i <= 20; i++) {
      const row = leftTableRow.content.cloneNode(true);
      row.querySelector('.row-number-cell').textContent = i + '.';
      ["length", "width", "quantity", "shape"].forEach((name) => {
        const cell = row.querySelector("#" + name + "-column");
        cell.id = "row" + i + "-" + name; // maybe not needed !!!!!!!
        cell.name = "row" + i + "-" + name;
        cell.setAttribute("aria-labelledby", name + "-label");
      });
      centralTable.appendChild(row);
    }
  }

  buildLeftTable();
})();
