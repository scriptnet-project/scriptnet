
// const sidePanelVariants = {
//   'show': { translateX: 0, opacity: 1, transition: { duration: 1 } },
//   'hide': { translateX: '-100%', opacity: 0, transition: { duration: 1 }  },
// };

// const bottomPanelVariants = {
//   'show': { translateY: 0, opacity: 1, transition: { duration: 1 }  },
//   'hide': { translateY: '100%', opacity: 0, transition: { duration: 1 }  },
// };

// const Panels = () => {
//   const [set, setSet] = useState('default');
//   const timer = useRef();
//   const cb = useRef();

//   const getPanels = (set) => {
//     switch (set) {
//       case 'foo':
//         return [
//           (
//             <motion.div key="4" initial="hide"
//             animate="show"
//             exit="hide" variants={sidePanelVariants} className="Panels--side">
//               FOOOO!
//             </motion.div>
