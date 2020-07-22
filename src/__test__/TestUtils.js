import { render } from '@testing-library/react'

export const expectToRenderNothing = (component) => {
  const containerDiv = document.createElement('div')
  document.body.appendChild(containerDiv)

  render(component, { container: containerDiv })

  expect(containerDiv).toBeEmptyDOMElement()
}
