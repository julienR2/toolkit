import packageInfo from '../../package.json'

const version = () => {
  console.log(`v${packageInfo.version}`)
}

export default version
