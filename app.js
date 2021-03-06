const fs = require('fs').promises

const artifactoryUrl = 'rtest1.jfrog.io'
const filename = './bundle.json'
const main = async () => {
    const data = JSON.parse(await fs.readFile(filename));
    const { artifacts } = data;
    const dockerArtifacts = artifacts.filter(a=>a.targetRepoPath?.endsWith('manifest.json'))
                            .map(a=>a.targetRepoPath
                            .split('/'))
                            .map(a=>{
                                // remove file name
                                a.pop()
                                const tag = a.pop();
                                const repository = a.shift()
                                const image = a.join('/')
                                const fullImage = `${artifactoryUrl}/${repository}/${image}:${tag}`
                                return  fullImage;
                            });
    for (let image of dockerArtifacts) {
        console.log(`docker pull ${image}`)
        const regex = /[\/\:\.]/ig

        const tmp = image.split('/').pop()
        const tarName =tmp.replace(regex,'_')      
        console.log(`docker save -o ${tarName}.tar ${image}`)

        //const dockerFileName=image.replace(regex,'_')      
        //console.log(`docker save -o ${dockerFileName}.tar ${image}`)

    }
}

main()
