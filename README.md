# React Information Flow

## Learning Goals

- Understand the flow of information between components with props
- Use callback functions as props to update state in a parent component

## Introduction

In this lesson, we'll explore how to pass callback functions as props in order
to change state in a parent component.

## How Does Information Flow Between Components?

We already know how to use props to pass information _down_ from parent to
child. But how would we do the reverse? How might we have a **child** component
send data _up_ to its **parent** component?

In order to propagate information in the opposite direction, we can send a
**callback function as props** from the parent component to its child.

This allows the callback to be _owned_ by a different component than the one
invoking it. Once invoked, the callback can send data to or change state in the
parent component that _owns_ it, instead of the child component that _invoked_
it.

## Getting Started

Assuming you pulled down the starter code and ran `npm install` and `npm start`,
you should see a few TypeScript errors being thrown in the browser. That's okay,
you will fix those as you continue through this code along. Feel free to click
the 'X' in the top right corner to close them out for the time being. Now, you
should see rectangles in your browser. The large outer rectangle will be a
random color every time you refresh the page, but the two smaller rectangles
inside will always have a white background.

Take a moment to familiarize yourself with the code base. We have a simple
application that renders a single `Parent` component and two `Child` components.
The component hierarchy is as follows:

```txt
App
└───Parent
    ├───Child
    └───Child
```

## Deliverables Part 1

- When either `Child` component is clicked, the `Parent` component should change
  color.

`src/randomColorGenerator.ts` has a helper function `getRandomColor()`
implemented for you that generates a random color.

### Changing the color of Parent

The `Parent` component has a state variable called `color` that is initially set
to a random color. To update state, we'll create a simple `handleChangeColor()`
function:

```jsx
function Parent() {
  const randomColor = getRandomColor();
  const [color, setColor] = useState(randomColor); // initial value for color state

  function handleChangeColor()() {
    const newRandomColor = getRandomColor();
    setColor(newRandomColor); // update color state to a new value
  }

  return (
    <div className="parent" style={{ backgroundColor: color }}>
      <Child />
      <Child />
    </div>
  );
}
```

But we are going to want to run this `handleChangeColor()` function when either
`Child` component is clicked. So we are going to pass this state changing
function _as a prop_ to both `Child` components.

```jsx
return (
  <div className="parent" style={{ backgroundColor: color }}>
    <Child onChangeColor={handleChangeColor} />
    <Child onChangeColor={handleChangeColor} />
  </div>
);
```

With these changes, all but one of the TypeScript errors should be resolved now
that `Child` will have a prop called `onChangeColor` that is a _function_.
Specifically, it is the same function object as our `Parent`'s
`handleChangeColor()` function. Want to see for yourself? Put a `console.log`
inside the `Child` component.

```jsx
function Child({ onChangeColor }) {
  console.log(onChangeColor);
  return (
    <div
      onClick={onChangeColor}
      className="child"
      style={{ backgroundColor: "#FFF" }}
    />;
  )
}
```

We can now fix the remaining TypeScript error that, rightfully, won't leave us
alone. Let's type the prop with an interface. `onChangeColor` is a function with
no return. We learned about this return type before, can you recall what it is?

If you thought [`void`][void type], you're correct! Let's use that to create our
`Props` interface:

```ts
interface Props {
  onChangeColor(): void;
}
```

We can now use this to type our `Child` props:

```jsx
function Child({ onChangeColor}: Props)
```

With typing done, we can use the `onChangeColor` prop as an event handler:

```jsx
console.log(onChangeColor);
return (
  <div
    onClick={onChangeColor}
    className="child"
    style={{ backgroundColor: "#FFF" }}
  />
);
```

And ta-da! Now, if you go to the app, clicking on _either_ of the white
rectangle `Child` components will cause the `Parent` component to change color.

Let's walk though those steps:

- When the `div` in the `Child` component is clicked, it will use the
  `onChangeColor` variable to determine what function to run
- `onChangeColor` is a prop that is passed down from the `Parent` component,
  which references the `handleChangeColor()` function
- The `handleChangeColor()` function is the function that will actually run when
  the `div` is clicked, and will update state in the `Parent` component

Now, let's add one more feature!

## Deliverables Part 2

- When either `Child` component is clicked, it should change its own background
  color to a random color, and the other `Child` component should change to
  _that same_ color.

Now, we could put some state in our `Child` component to keep track of its
color. However:

- **Sibling components cannot pass data to each other directly**
- **Data can only flow up and down between parent and child**

So if we update the color of one `Child` component, we have no way to pass that
data to the _other_ `Child` component.

The solution is to store the color of the `Child` in the state of the `Parent`
component. Then, we let the `Parent` component handle the passing of that data
to each of its children components. We'll start by creating a variable to keep
track of the color of the `Child` components using state:

```jsx
function Parent() {
  const randomColor = getRandomColor();
  const [color, setColor] = useState(randomColor);
  const [childrenColor, setChildrenColor] = useState("#FFF");

  // ...
}
```

Since the data that represents the color of the two `Child` components lives in
`Parent`, we should pass that data down as props:

```jsx
return (
  <div className="parent" style={{ backgroundColor: color }}>
    <Child color={childrenColor} onChangeColor={handleChangeColor} />
    <Child color={childrenColor} onChangeColor={handleChangeColor} />
  </div>
);
```

Now let's actually use that props data in the `Child` component. We can replace
the hard coded `backgroundColor` to use the `color` prop:

```jsx
function Child({ onChangeColor, color }) {
  return (
    <div
      onClick={onChangeColor}
      className="child"
      style={{ backgroundColor: color }}
    />
  );
}
```

Uh-oh, TypeScript's warning us again! Because we added a new prop, we need to
type it as well so our component knows exactly what to expect. Let's add it to
our interface. This time, we're not passing down a function, the `color` prop is
just passing down a string:

```ts
// Child.tsx
interface Props {
  onChangeColor(): void;
  color: string;
}
```

Lastly, we have to update the `handleChangeColor()` function in `Parent` to
change not just the `color` state, but also the `childrenColor`. To practice
sending data _back_ to the parent, let's change our `handleChangeColor()` to
take in an argument of `newChildColor` and then use that variable to update the
state of the `Child` component:

```jsx
// Parent.tsx
function handleChangeColor(newChildColor) {
  const newRandomColor = getRandomColor();
  setColor(newRandomColor);
  setChildrenColor(newChildColor);
}
```

Oh no! TypeScript is warning us of something again. It says:

`TS2322: Type '(newChildColor: any) => void' is not assignable to type '() => void'.`

on the line:

`<Child color={childrenColor} onChangeColor={handleChangeColor} />`

This is because we've now added a parameter to the `handleChangeColor()`
function that we didn't tell TypeScript about yet. Let's fix that by first
specifying what we expect the parameter type to be. In this case, we expect it
to be a color code, which will be a `string`.

```jsx
// Parent.tsx
function handleChangeColor(newChildColor: string) {
  // ...
}
```

That still doesn't remove the error, because now we have to tell the `Child`'s
`Prop` interface about this new change:

```ts
interface Props {
  onChangeColor(newChildColor: string): void;
  color: string;
}
```

That error is now gone! But now we have a whole new error. That's okay, we're
going to fix that next.

Now that the function takes in an argument, we can create a new function in our
`Child` component that invokes `onChangeColor` and passes in a random color as
the argument; we also need to update the component's `onClick` callback to be
that new function:

```jsx
function Child({ onChangeColor, color }) {
  function handleClick() {
    const newColor = getRandomColor();
    onChangeColor(newColor);
  }

  return (
    <div
      onClick={handleClick}
      className="child"
      style={{ backgroundColor: color }}
    />
  );
}
```

Wow! Check out the finished product in the browser! When either `Child`
component is clicked, the `Parent` changes to a random color, and both `Child`
components change to a different random color.

## Conclusion

For information to propagate **down** the component tree, parents pass `props`
to their children.

For information to propagate **up** the component tree, we must invoke
**callbacks** that were passed from parents to children as `props`. When
invoking the callback, we can pass any needed values from the child component to
the parent component as arguments.

Components of the same level (sibling components) cannot communicate directly!
We can only communicate up and down the component tree. So if multiple
components need to share the same information, that state should live in the
parent component (or a more general ancestor).

The larger your projects get, the more unweildy this can get. If you find
yourself getting lost in your own code, don't worry you're not alone! It may be
a good idea to sketch out a component tree and track where data begins and
flows. Find what planning and organizational tactics work for you.

## Resources

- [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html)

[void type]:
  https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions
