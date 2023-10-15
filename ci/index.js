import { connect } from "@dagger.io/dagger"

connect(async (client) => {
  const nodeCache = client.cacheVolume("node")

  const source = client.container()
    .from("node:16-slim")
    .withDirectory('/src', client.host().directory('.'), { exclude: ["node_modules/", "ci/"] })
    .withMountedCache("/src/node_modules", nodeCache)

  const runner = source
    .withWorkdir("/src")
    .withExec(["npm", "install"])

  await runner
    .withExec(["npm", "test", "--", "--watchAll=false"])
    .stderr()

}, { LogOutput: process.stdout })
