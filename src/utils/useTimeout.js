import React, { useEffect, useState } from "react";

//
// useTimeout React Hook
//
// React hook for delaying calls with time
const useTimeout = (
	callback, // function to call. No args passed.
	timeout = 0, // delay, ms (default: immediately put into JS Event Queue)
	{
		// manage re-render behavior.
		// by default, a re-render in your component will re-define the callback,
		//    which will cause this timeout to cancel itself.
		// to avoid cancelling on re-renders (but still cancel on unmounts),
		//    set `persistRenders: true,`.
		persistRenders = false,
	} = {},
	// These dependencies are injected for testing purposes.
	// (pure functions - where all dependencies are arguments - is often easier to test)
	_setTimeout = setTimeout,
	_clearTimeout = clearTimeout,
	_useEffect = useEffect
) => {
	let timeoutId;
	const cancel = () => timeoutId && _clearTimeout(timeoutId); //returns timeoutId and clears the timeout of that id

	_useEffect(
		() => {
			timeoutId = _setTimeout(callback, timeout);
			return cancel;
		},
		persistRenders
			? [_setTimeout, _clearTimeout]
			: [callback, timeout, _setTimeout, _clearTimeout]
	);

	return cancel;
};

//
// Example Component
//

// In console, you should see 'B' trigger first, then 'A', even though 'A's timeout is shorter.
// This is because 'A' was cancelled after 3 seconds during the re-render. It was then re-scheduled to be 6 seconds after *this* re-render, not the initial render.
// 'B' was not cancelled, because persistRenders was set.

const Example_InterruptingCow = () => {
	// 6 seconds, persistRenders=false
	const a = () => {
		console.log("Hey, A triggered!");
	};
	useTimeout(a, 6 * 1000, { persistRenders: false });

	// 7 seconds, persistRenders=true
	const b = () => {
		console.log("Hey, B triggered!");
	};
	useTimeout(b, 7 * 1000, { persistRenders: true });

	// 4 seconds, persistRenders=true
	// This will never be called, because it will be cancelled after 3 seconds.
	// It will not be re-scheduled, because it will persistRenders
	const endOfTheWorld = () => {
		alert("It's the end of the world!");
	};
	const saveWorld = useTimeout(endOfTheWorld, 4 * 1000, {
		persistRenders: true,
	});

	// Trigger a re-render after 3 seconds
	const [moo, setMoo] = useState(false);
	const mooTimeout = () => {
		setMoo(true);
		saveWorld(); // good news, the end of the world is officially cancelled.
	};
	useTimeout(mooTimeout, 3 * 1000, { persistRenders: false });

	return <p>{moo ? "Re-rendered! Moo!" : "First render..."}</p>;
};

export { Example_InterruptingCow };

export default useTimeout;
