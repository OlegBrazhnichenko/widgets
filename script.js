const SIZE = 100;
const DASHBOARD_WIDTH  = 8;
const DASHBOARD_HEIGHT = 5;
const DASHBOARD = {x: 0, y: 0, w: DASHBOARD_WIDTH, h: DASHBOARD_HEIGHT};

var widgets = {
    widgets: [

    ],
    getWidgets: function() {
        return this.widgets.sort(function(a, b) {
            return a["y"] - b["y"] || a["x"] - b["x"];
        })
    },
    addNewWidget: function(newWidget) {
        this.widgets.push(newWidget);
    }
};

window.onload = function() {
    displayWidgets(widgets.getWidgets());
};

function displayWidgets(widgets) {
    var dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = '';
    for (var i = 0; i<widgets.length; i++) {
        ShowWidget(widgets[i]);
    }
}

function ShowWidget(widgetCoords){
    var dashboard = document.getElementById('dashboard');
    var widget = document.createElement('div');
    widget.className = "widget";
    widget.style.top = (widgetCoords.x * SIZE)+'px';
    widget.style.left = (widgetCoords.y * SIZE)+'px' ;
    widget.style.width = (widgetCoords.w * SIZE)+'px' ;
    widget.style.height = (widgetCoords.h * SIZE)+'px' ;
    var image = document.createElement('img');
    if ( widget.style.width > widget.style.height ) {
        image.src = 'images/image1.png';
    } else if ( widget.style.width < widget.style.height ) {
        image.src = 'images/image3.png';
    } else {
        image.src = 'images/image2.png';
    }
    widget.appendChild(image);
    console.log(widget);
    dashboard.appendChild(widget);

}

function set(newWidget){
    widgets.addNewWidget(newWidget);
    ShowWidget(newWidget);
}

function createNewWidget() {
    var newWidget = {
        w : parseInt(document.getElementById('width').value),
        h : parseInt(document.getElementById('height').value)
    };
    if (newWidget.w > 0 && newWidget.h > 0) {
        var coordinatesToSet = getSettableCoordinates(newWidget);
        if (coordinatesToSet) {
            set(Object.assign(newWidget, coordinatesToSet));

            return true;
        }else{
            console.log("That unreal, sry :(");
        }
    } else {
        console.error("please enter correct height & width. It must be more than zero!");
    }

}

function getSettableCoordinates(newWidget) {

    return checkEachDashboardPoint(newWidget);
}

function checkEachDashboardPoint(newWidget) {
    var settableCoordinates;
    for (var i = 0; i < DASHBOARD_HEIGHT; i++) {
        for (var j = 0; j < DASHBOARD_WIDTH; j++) {
            settableCoordinates = checkEachWidgetPoint(newWidget, j, i);

            if (settableCoordinates) {

                return settableCoordinates;
            }
        }
    }

    return false;
}

function checkEachWidgetPoint(newWidget, dashboardW, dashboardH) {
    for (var i = 0; i < newWidget.h; i++) {
        for (var j = 0; j < newWidget.w; j++) {
            var point = {x: i+dashboardH+0.5, y: j+dashboardW+0.5};
            if (overflowDashboard(point, DASHBOARD)) {

                return false;
            }
            if (isCollapseWithWidgets(point, widgets.getWidgets())) {

                return false;
            }
        }
    }

    return {x: dashboardH, y: dashboardW};
}

function getCornersOfWidget(widget){
    return {
        A: {x: widget.x,            y: widget.y},
        B: {x: widget.x,            y: (widget.y+widget.w)},
        C: {x: (widget.x+widget.h), y: (widget.y+widget.w)},
        D: {x: (widget.x+widget.h), y: widget.y}
    };
}

function isCollapseWithWidgets(point, allWidgets) {
    for (var i = 0; i < allWidgets.length; i++) {

        if(point.x === allWidgets[i].x && point.y === allWidgets[i].y){

            return true;
        }

        if (isInWidget(point, allWidgets[i])) {

            return true;
        }
    }

    return false;
}

function isInWidget(point, widget) {
    // coordinates of all widget corners
    var wCorners = getCornersOfWidget(widget);

    return pointInWidgetArea(point, widget, wCorners);
}

function pointInWidgetArea(point, widget, wCorners) {
    // Widget area
    var wArea = getWidgetArea(widget);
    var sumTrianglesArea =parseFloat((
        getTriangleArea(point, wCorners.A, wCorners.B) +
        getTriangleArea(point, wCorners.B, wCorners.C) +
        getTriangleArea(point, wCorners.C, wCorners.D) +
        getTriangleArea(point, wCorners.D, wCorners.A)
    ).toFixed(6));

    return wArea === sumTrianglesArea;
}

function getTriangleArea(A, B, C) {
    var triangleSides = {
        AB: getLineLengthByCoords(A, B),
        BC: getLineLengthByCoords(B, C),
        CA: getLineLengthByCoords(C, A)
    };
    // half of perimeter of triangle
    var hp = ((triangleSides.AB + triangleSides.BC + triangleSides.CA) / 2);

    return Math.sqrt(hp * (hp-triangleSides.AB) * (hp-triangleSides.BC) * (hp-triangleSides.CA));
}

function getLineLengthByCoords(startPoint, endPoint){

    return Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
}

function getWidgetArea(widget){
    return (
        getLineLengthByCoords({x: widget.x, y: widget.y}, {x: widget.x, y: (widget.y+widget.w)})
        *
        getLineLengthByCoords({x: widget.x, y: widget.y}, {x: (widget.x+widget.h), y: widget.y})
    );
}

function overflowDashboard(point, dashboard){

    var dashboardCorners = getCornersOfWidget(dashboard);

    return !pointInWidgetArea(point, DASHBOARD, dashboardCorners);
}