const App = {
    depth: 0,
    persons: [],
    levels: {}
}


document.addEventListener('DOMContentLoaded', function (event) {
    App.svg = d3.select('body').append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)
})

fetch('docs/family-tree.json').then((response) => response.json()).then(function (data) {
    iterate(data)

    App.groupByLevels(App.persons)

    console.log(App.levels)

    for (let i in App.levels) {
        App.addLevel(i, App.levels[i])
    }
})

function iterate(object)
{
    for (let property in object) {
        if (object.hasOwnProperty(property)) {

            if (property === 'level' && object[property] === 0) {
                App.persons.push(object)
            }

            if (property === 'mother') {
                App.persons.push(object[property])
                iterate(object[property])
            }

            if (property === 'father') {
                App.persons.push(object[property])
                iterate(object[property])
            }
        }
    }
}

App.groupByLevels = function (persons) {
    for (let i in persons) {
        let person = persons[i]

        if (typeof App.levels[person.level] === 'undefined') {
            App.levels[person.level] = []
        }

        App.levels[person.level].push(person)
    }
}

App.addLevel = function (index, level) {

    let y = window.innerHeight - 100 * (parseInt(index) + 1);

    for(let i in level) {
        let x = 150 * (parseInt(i) + 1);
        App.addPerson(level[i], x, y);
    }

}

App.addPerson = function (object, x, y) {
    let g = App.svg.append("g");

    g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("fill", "#000")
        .attr('width', 100)
        .attr('text-anchor', 'middle')
        .text(object.name)

    g.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('stroke', '#C1A6FF')
        .attr('fill', 'transparent')
        .attr('width', 100)
        .attr('height', 50)
}
