import construct_navbar from './App.tsx'

function render_page() {
    return (
        construct_navbar()
    )
}

function render_project_divs() {
    const projectData = fetch("http:/localhost:8000/api/query_sql?query=SELECT * FROM repositories")
    for (let i = 0; i < pr)
}

export default render_page
