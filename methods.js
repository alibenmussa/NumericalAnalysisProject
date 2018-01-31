/**************************
@Author: Ali Ben Mussa
Numerical Analysis Course Project
About Interpolation Methods
***************************/

class Method {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.n = x.length;
        this.point = 4;
    }

    // تعيين قيمة التقريب إلى كم رقم بعد العلامة العشرية
    setAfterPoint(x) {
        this.point = x;
    }

    // تقريب الناتج
    fixed(x) {
        return x.toFixed(this.point) / 1;
    }

    print() {
        return "";
    }
}

// الاستكمال الخطي
class LinerInterpolation extends Method {
    constructor(value, x, y) {
        super(value, x, y);
        this.cr = this.findXinTable();
        this.fx = this.calculateLinerInterpolation();
    }

    // البحث عن القيمتين المحصور بينهما قيمة x
    findXinTable() {
        for (var i = 1; i < this.n; i++) {
            if (this.value < this.x[i]) {
                return [
                    [this.x[i - 1], this.y[i - 1]],
                    [this.x[i], this.y[i]]
                ];
            }
        }
    }

    calculateLinerInterpolation() {
        var m = (this.cr[1][1] - this.cr[0][1]) / (this.cr[1][0] - this.cr[0][0]);
        var f = (m * (this.value - this.cr[0][0])) + this.cr[0][1];
        return this.fixed(f);
    }
}

// طريقة غريغوري نيوتن
class GrigoriNewton extends Method {
    constructor(value, x, y) {
        super(value, x, y);
        this.a = this.findA();
        this.fx = this.calculateGrigoriNewton();
    }

    // إيجاد قيم a
    findA() {
        var a = [];
        a[0] = this.y[0];
        for (var i = 1; i < this.n; i++) {
            var l = 1;
            var k = this.y[i];
            for (var j = 0; j < i; j++) {
                if (j > 0) {
                    l *= this.x[i] - this.x[j - 1];
                }
                k -= (a[j] * l);
            }
            l *= this.x[i] - this.x[i - 1];
            a[i] = k / l;
        }
        return a;
    }

    calculateGrigoriNewton() {
        var f = 0;
        var l = 1;
        for (var i = 0; i < this.n; i++) {
            if (i > 0) {
                l *= this.value - this.x[i - 1];
            }
            f += this.a[i] * l;
        }
        return this.fixed(f);
    }

    // طباعة قيم a
    print() {
        var a = [];
        for (var i = 0; i < this.n; i++) {
            a.push("a" + (i + 1) + " = " + this.a[i]);
        }
        return "<span>" + a.join("</span><span>") + "</span>";
    }
}

// طريقة لاجرانج
class Lagrange extends Method {
    constructor(value, x, y) {
        super(value, x, y);
        this.fx = this.calculateLagrange();
    }

    calculateLagrange() {
        var h = 0;
        for (var i = 0; i < this.n; i++) {
            var f = 1;
            var m = this.x[i];
            for (var j = 0; j < this.n; j++) {
                if (j != i) {
                    var k = (this.value - this.x[j]) / (m - this.x[j]);
                    f *= k;
                }
            }
            f *= this.y[i];
            h += f;
        }
        return this.fixed(h);
    }
}

// طرق نيوتن للفروق
class NewtonDifference extends Method {
    constructor(value, x, y) {
        super(value, x, y);
        this.name = "";
        this.positionX = this.findPositionOfX();
        this.y = this.diffrentialTable(this.y);
        this.h = this.x[this.n - 1] - this.x[this.n - 2];
        this.s = this.extendsTable(this.y);
        this.forPrint = ["h = " + this.h];
        this.selectNewtonDifference();
    }

    // جدول الفروق
    diffrentialTable(yValues) {
        var y = this.twoDimentionArray(this.n, this.n);
        y[0] = yValues;
        var k = this.n - 1;
        for (var i = 1; i < this.n; i++) {
            for (var j = 0; j < k; j++) {
                y[i][j] = this.fixed(y[i - 1][j + 1] - y[i - 1][j]);
            }
            k--;
        }
        return y;
    }

    // طريقة نيوتن للفروق المتقدمة
    forwardNewtonDifference() {
        var f = this.y[0][0];
        var l = 1;
        for (var i = 0; i < this.n - 1; i++) {
            l *= (this.value - this.x[i]);
            var c = this.fact(i + 1) * Math.pow(this.h, i + 1);
            f += (this.y[i + 1][0] * l) / c;
        }
        return this.fixed(f);
    }

    // طريقة نيوتن للفروق المتأخرة
    backwardNewtonDifference() {
        this.k = this.fixed((this.value - this.x[this.n - 1]) / this.h);
        var f = this.y[0][this.n - 1];
        var l = 1;
        var xValues = [];
        for (var i = this.n - 1, j = 0; i >= 0; i--) {
            xValues[i] = this.x[j];
            j++;
        }
        for (var i = 1; i < this.n - 1; i++) {
            var c = this.fact(i) * Math.pow(this.h, i - 1);
            f += (this.k * this.y[i][this.y[i].length - 1] * l) / c;
            l *= (this.value - xValues[i]);
        }
        return this.fixed(f);
    }

    // طرقة نيوتن للفروق المركزية - جاوس
    centralNewtonDifference() {
        this.p = this.fixed((this.value - this.x[this.positionX]) / this.h);
        var c = this.positionX * 2;
        var f = this.s[0][c];
        var v = this.n - (Math.abs(Math.floor(this.n / 2) - (this.positionX + 1)));
        var l = 1;
        var m = 0.5;
        for (var i = 1; i < v - 1; i++) { // x center
            l *= this.p + (Math.pow(-1, i - 1) * Math.floor(m));
            var k = (i % 2 == 0) ? this.s[i][c] : this.s[i][c + 1];
            f += ((l * k) / this.fact(i));
            m += 0.5;
        }
        return this.fixed(f);
    }

    // تحديد طريقة نيوتن للفروق المناسبة
    selectNewtonDifference() {
        var a = this.x[1];
        var b = this.x[this.n - 2];
        if (this.value < a) {
            this.name = "المتقدمة";
            this.fx = this.forwardNewtonDifference();
        } else if (this.value > b) {
            this.name = "المتأخرة";
            this.fx = this.backwardNewtonDifference();
            this.forPrint.push("k = " + this.k);
        } else if (this.value > a && this.value < b) {
            this.name = "المركزية (جاوس)";
            this.fx = this.centralNewtonDifference();
            this.forPrint.push("p = " + this.p);
        }
    }

    // توسيع المصفوفة للطباعة
    extendsTable() {
        var s = this.twoDimentionArray(this.n, (this.n * 2) - 1);
        var m = 0;
        for (var i = 0; i < this.n; i++) {
            for (var j = 0; j < this.y[i].length; j++) {
                s[i][(j * 2) + m] = this.y[i][j];
            }
            m++;
        }
        return s;
    }

    // إيحاد مضروب عدد
    fact(n) {
        var k = 1;
        for (var i = 1; i <= n; i++) {
            k *= i;
        }
        return k;
    }

    // إنشاء مصفوفة ثنائية الأبعاد متعددة الحجم
    twoDimentionArray(n, m) {
        var y = new Array(n);
        for (var i = 0; i < n; i++) {
            y[i] = new Array(m - i);
        }
        return y;
    }

    // إيجاد موقع x0
    findPositionOfX() {
        for (var i = 1; i < this.n; i++) {
            if (this.value < this.x[i]) {
                return (i - 1);
            }
        }
    }

    // طباعة قيم h, k, p
    print() {
        return "<span>" + this.forPrint.join("</span><span>") + "</span>";
    }
}

// طرق المربعات الصغرى
class LatestSquares extends Method {
    constructor(value, x, y) {
        super(value, x, y);
        this.sumX = this.sum(this.x);
        this.sumXsquare = this.sumTwo(this.x, this.x);
        this.sumY = this.sum(this.y);
        this.sumXY = this.sumTwo(this.x, this.y);
        this.first = [
            [this.n, this.sumX],
            [this.sumX, this.sumXsquare]
        ];
        this.second = [this.sumY, this.sumXY];
        var ab = this.calculateAB(this.first, this.second);
        this.a = this.fixed(ab[0]);
        this.b = this.fixed(ab[1]);
    }

    // إيجاد المحدد
    det(m) {
        return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
    }

    // إيجاد المعكوس
    inverse(m) {
        var a = this.det(m);
        m = [
            [m[1][1], ((-1) * m[0][1])],
            [((-1) * m[1][0]), m[0][0]]
        ]
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                m[i][j] *= (1 / a);
            }
        }
        return m;
    }

    // ضروب مصفوفتين
    calculateAB(f, s) {
        f = this.inverse(f);
        return [(f[0][0] * s[0]) + (f[0][1] * s[1]),
            (f[1][0] * s[0]) + (f[1][1] * s[1])
        ];
    }

    // طباعة المعادلة
    print() {
        return this.equation;
    }
}

// طريقة المربعات الصغرى الخطية
class LinearLatestSquares extends LatestSquares {
    constructor(value, x, y) {
        super(value, x, y);
        this.fx = this.calculateFX(this.value);
        this.equation = "f(x) = " + this.a + " + " + this.b + "x";
    }

    // حساب المعادلة
    calculateFX(x) {
        return this.fixed(this.a + (x * this.b));
    }

    sumTwo(a, b) {
        var sum = 0;
        for (var i = 0; i < this.n; i++) {
            sum += a[i] * b[i];
        }
        return sum;
    }

    sum(a) {
        var sum = 0;
        for (var i = 0; i < this.n; i++) {
            sum += a[i];
        }
        return sum;
    }
}

// طريقة المربعات الصغرى الغير خطية
class NonLinearLatestSquares extends LatestSquares {
    constructor(value, x, y) {
        super(value, x, y);
        this.a = this.fixed(Math.exp(this.a));
        this.fx = this.calculateFX(this.value);
        this.equation = "f(x) = " + this.a + " * (x ^ " + this.b + ")";
    }

    // حساب المعادلة
    calculateFX(x) {
        return this.fixed(this.a * Math.pow(x, this.b));
    }

    sumTwo(a, b) {
        var sum = 0;
        for (var i = 0; i < this.n; i++) {
            sum += this.fixed(Math.log(a[i]) * Math.log(b[i]));
        }
        return sum;
    }

    sum(a) {
        var sum = 0;
        for (var i = 0; i < this.n; i++) {
            sum += this.fixed(Math.log(a[i]));
        }
        return sum;
    }
}