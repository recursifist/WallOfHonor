import * as THREE from 'three'

const loadJSON = async (jsonFileName) => {
  const response = await fetch(jsonFileName)
  const jsonData = await response.json()
  return jsonData.data?.sort(() => Math.random() > 0.5 ? 1 : -1)
}

const isMobile = () => /Mobi/i.test(navigator.userAgent)

const calculateFOV = (container) => {
  const cW = container.clientWidth
  if (cW < 482) return 60
  else if (cW < 760) return 50
  else return 36
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-0.9, 0.9)
let hoveredItem = null

function checkIntersection(camera, container, textGroup) {
  try {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(textGroup.children, true)
    container.style.cursor = 'default'
    textGroup.children.forEach(item => {
      item.nameMesh.material.metalness = 0.6
      item.nameMesh.parent.position.z = 0.26
    })

    if (hoveredItem) hoveredItem = null

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object.parent

      for (const item of textGroup.children) {
        if (item.uuid === intersectedObject.uuid) {
          container.style.cursor = 'pointer'
          hoveredItem = intersectedObject
          hoveredItem.nameMesh.parent.position.z = 0.25
          hoveredItem.nameMesh.material.metalness = 0
          break
        }
      }
    }
  } catch (error) {
    console.error('Error in raycasting:', error)
  }
}

function setupMouseEvents(camera, container, textGroup, setSelectedDetails) {
  container.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    checkIntersection(camera, container, textGroup)
  })

  container.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    checkIntersection(camera, container, textGroup)

    setSelectedDetails(undefined)
    if (hoveredItem) {
      hoveredItem.nameMesh.material.metalness = 0
      setTimeout(() => {
        hoveredItem.nameMesh.material.metalness = 0.6
      }, 600)
      setSelectedDetails(hoveredItem.record)
    }
    e.preventDefault()
  })
}

export default {
  loadJSON,
  isMobile,
  calculateFOV,
  setupMouseEvents,
  checkIntersection
}