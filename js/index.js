var data = {
    value: 0,
    valid: false
}

$(document).ready(function () {

    var cells = $("table.values .x-values .cell").length;

    var m = "x";
    for (var i = 1; i <= 2; i++) {
        var n = 1;
        $("table.values ." + m + "-values .cell").each(function () {
            $(this).attr("placeholder", m + n);
            n++;
        });
        m = "y";
    }

    $('.add').click(function () {
        if (cells < 10) {
            $('table.values tr .control').before("<td><input type='text' class='cell'></td>");
            cells++;
            $('table.values .x-values .control').prev().children().attr("placeholder", "x" + cells);
            $('table.values .y-values .control').prev().children().attr("placeholder", "y" + cells);
        }
    });

    $('.remove').click(function () {
        if (cells > 2) {
            $('table.values .x-values td:last').prev().remove();
            $('table.values .y-values td:last').prev().remove();
            cells--;
        }
    });

    $(".method").click(function () {
        data.id = $(this).index() + 1;
        data.x = [],
            data.y = [];
        data.value = parseFloat($("#get-x").val());


        var i = 0;
        $("table.values .x-values td .cell").each(function (a) {
            data.x[i] = parseFloat($(this).val());
            if (isNaN(data.x[i])) {
                data.valid = false;
            }
            i++;
        });

        var j = 0;
        $("table.values .y-values td .cell").each(function (a) {
            data.y[j] = parseFloat($(this).val());
            if (isNaN(data.y[j])) {
                data.valid = false;
            }
            j++;
        });
        data.valid = !(isNaN(data.value));
        switch (data.id) {
            case 1:
            case 3:
            case 4:
                if (data.value < data.x[0] || data.value > data.x[data.x.length - 1]) {
                    data.valid = false;
                }
                break;
        }

        if (data.valid) {
            $("#show-x").val(data.value);
            $("#component-1").hide();
            $("#component-2").show();

            if (data.x.indexOf(data.value) < 0) {
                selectMethod(data.id, $(this));
            } else {
                $("#result").text(data.y[data.x.indexOf(data.value)]);
            }

        } else {
            alert("لم تقم بإدخال البيانات بشكل صحيح");
        }
    });

    function selectMethod(x, type) {
        var t;
        $("#type").text("طريقة " + type.text());
        switch (Number(x)) {
            case 1:
                t = new LinerInterpolation(data.value, data.x, data.y);
                break;
            case 2:
                t = new GrigoriNewton(data.value, data.x, data.y);
                break;
            case 3:
                t = new Lagrange(data.value, data.x, data.y);
                break;
            case 4:
                t = new NewtonDifference(data.value, data.x, data.y);
                printTable(data.x, t.s);
                $("#type").text($("#type").text() + " " + t.name);
                break;
            case 5:
                t = new LinearLatestSquares(data.value, data.x, data.y);
                break;
            case 6:
                t = new NonLinearLatestSquares(data.value, data.x, data.y);
                break;
            default:
                console.log("خطأ!");
        }

        $("#result").text(t.fx);
        $("#results").html(t.print() + $("#results").html());
    }

    function printTable(x, s) {
        var n = x.length;
        var c = (n * 2) - 1;
        var table = "<table class='table' id='diffrentialTable'><tr><td class='primary'>x</td><td class='primary'>y</td>";
        for (var i = 1; i < n; i++) {
            table += "<td class='primary'>△" + i + "y"
        }
        table += "</tr>";
        for (var i = 0; i < c; i++) {
            table += "<tr id='r" + i + "'>";
            for (var j = 0; j <= n; j++) {
                if (j > 0) {
                    var v = (((j - 1) * c) + i);
                    if (j > 1) {
                        table += "<td class='c" + v + "'>";
                    } else {
                        table += "<td class='c" + v + " main-cell'>";
                    }
                } else {
                    if (i % 2 == 0) {
                        table += "<td class='main-cell'>" + x[i / 2] + "</td>";
                    } else {
                        table += "<td class='main-cell'></td>";
                    }
                }
            }
            table += "</tr>";
        }
        table += "</table>";
        $("#results").html(table);
        printDiffrentialTable(s, n, c);
    }

    function printDiffrentialTable(s, n, c) {
        var m = 0;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < c; j++) {
                $("#diffrentialTable #r" + j + " .c" + m).text(s[i][j]);
                m++;
            }
        }
    }

    $("#back").click(function () {
        $("#component-1").show();
        $("#component-2").hide();
        $("#results").html("");
        $("#type").text("");
    });
});