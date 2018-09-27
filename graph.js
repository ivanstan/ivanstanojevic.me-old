let App = {}
App.persons = {}
App.families = {}

App.getData = () => {
    let x2js = new X2JS()

    return fetch('docs/data.gramps')
        .then(response => response.text())
        .then(data => x2js.xml_str2json(data))
}

App.init = (data) => {
    for (let i in data.database.families.family) {
        let family = data.database.families.family[i]
        let father = App.persons[family.father._hlink]

        App.families[family._handle] = family
    }

    for (let i in data.database.people.person) {
        let person = data.database.people.person[i]

        App.persons[person._handle] = person
    }

    console.log(App.families, App.persons)

    var graph = {
        'nodes': [
            {'id': 'Myriel', 'group': 1},
            {'id': 'Napoleon', 'group': 1},
            {'id': 'Mlle.Baptistine', 'group': 1},
            {'id': 'Mme.Magloire', 'group': 1},
            {'id': 'CountessdeLo', 'group': 1},
            {'id': 'Geborand', 'group': 1},
            {'id': 'Champtercier', 'group': 1},
            {'id': 'Cravatte', 'group': 1},
            {'id': 'Count', 'group': 1},
        ],
        'links': [
            {'source': 'Napoleon', 'target': 'Myriel', 'value': 1},
            {'source': 'Mlle.Baptistine', 'target': 'Myriel', 'value': 1},
            {'source': 'Mme.Magloire', 'target': 'Myriel', 'value': 1},
            {'source': 'Mme.Magloire', 'target': 'Mlle.Baptistine', 'value': 1},
            {'source': 'CountessdeLo', 'target': 'Myriel', 'value': 1},
            {'source': 'Geborand', 'target': 'Myriel', 'value': 1},
            {'source': 'Champtercier', 'target': 'Myriel', 'value': 1},
            {'source': 'Cravatte', 'target': 'Myriel', 'value': 1},
            {'source': 'Count', 'target': 'Myriel', 'value': 1},
        ]
    }


    var svg = d3.select('svg'),
        width = +svg.attr('width'),
        height = +svg.attr('height')

    var color = d3.scaleOrdinal(d3.schemeCategory20)

    var nd
    for (var i = 0; i < graph.nodes.length; i++) {
        nd = graph.nodes[i]
        nd.rx = nd.id.length * 4.5
        nd.ry = 12
    }

    var simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(function (d) {
            return d.id
        }))
        .force('collide', d3.ellipseForce(6, 0.5, 5))
        .force('center', d3.forceCenter(width / 2, height / 2))

    var link = svg.append('g')
        .attr('class', 'link')
        .selectAll('line')
        .data(graph.links)
        .enter().append('line')
        .attr('stroke-width', 5)

    var node = svg.append('g')
        .attr('class', 'node')
        .selectAll('ellipse')
        .data(graph.nodes)
        .enter().append('ellipse')
        .attr('rx', function (d) {
            return d.rx
        })
        .attr('ry', function (d) {
            return d.ry
        })
        .attr('fill', function (d) {
            return color(d.group)
        })

    var text = svg.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(graph.nodes)
        .enter().append('text')
        .attr('dy', 2)
        .attr('text-anchor', 'middle')
        .text(d => d.id)
        .attr('fill', 'white')


    simulation
        .nodes(graph.nodes)
        .on('tick', ticked)

    simulation.force('link')
        .links(graph.links)

    function ticked()
    {
        link
            .attr('x1', function (d) {
                return d.source.x
            })
            .attr('y1', function (d) {
                return d.source.y
            })
            .attr('x2', function (d) {
                return d.target.x
            })
            .attr('y2', function (d) {
                return d.target.y
            })

        node
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
        text
            .attr('x', function (d) {
                return d.x
            })
            .attr('y', function (d) {
                return d.y
            })

    }

}

App.getData().then(data => App.init(data))
