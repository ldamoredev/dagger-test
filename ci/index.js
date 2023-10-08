import { connect } from "@dagger.io/dagger"

connect(async (client) => {

    // use a node:16-slim container
    // mount the source code directory on the host
    // at /src in the container
    const source = client.container()
        .from("node:16-slim")
        .withDirectory('/src', client.host().directory('.'), { exclude: ["node_modules/", "ci/"] })

    // set the working directory in the container
    // install application dependencies
    const runner1 = source
        .withWorkdir("/src")
        .withExec(["ls"])
    const  out1 = await runner1.stderr()
    console.log(out1)
    const runner = source
        .withWorkdir("/src")
        .withExec(["npm", "install"])


    // run application tests
    const out = await runner
        .withExec(["npm", "test", "--", "--watchAll=false"])
        .stderr()
    console.log(out)

}, { LogOutput: process.stdout })
