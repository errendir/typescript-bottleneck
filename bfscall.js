const debugMessage = Symbol("debugMessage")
const scheduleCall = Symbol("scheduleCall")
const receiveCalls = Symbol("receiveCalls")

function bfsExhaust(iterator) {
  const scheduledIterators = [iterator]
  const callDescriptorByIterator = new Map()
  callDescriptorByIterator.set(iterator, { isRootIterator: true })

  // Collect all calls from each iterator
  while(scheduledIterators.length !== 0) {
    const currentIterator = scheduledIterators.shift()
    const currentCallDescriptor = callDescriptorByIterator.get(currentIterator)

    let scheduledCallIndex = 0
    while(true) {
      let value, done
      if(currentCallDescriptor.isInCall) {
        ({ value, done } = currentIterator.next(currentCallDescriptor.returnedValues))
        currentCallDescriptor.isInCall = false
      } else {
        ({ value, done } = currentIterator.next())
      }
      if(done) {
        if(currentCallDescriptor.isRootIterator) {
          return value
        }
        const parentCallDescriptor = callDescriptorByIterator.get(currentCallDescriptor.parentIterator)
        parentCallDescriptor.returnedValues[currentCallDescriptor.parentCallIndex] = value
        parentCallDescriptor.remainingCount -= 1
        if(parentCallDescriptor.remainingCount === 0) {
          scheduledIterators.push(currentCallDescriptor.parentIterator)
        }
        callDescriptorByIterator.delete(currentIterator)
        break
      } else if(value[scheduleCall]) {
        scheduledIterators.push(value[scheduleCall])
        callDescriptorByIterator.set(value[scheduleCall], {
          parentIterator: currentIterator,
          parentCallIndex: scheduledCallIndex,
        })
        scheduledCallIndex += 1
      } else if(value[debugMessage]) {
        console.log(value[debugMessage])
      } else if(value[receiveCalls]) {
        break
      }
    }
    currentCallDescriptor.returnedValues = []
    currentCallDescriptor.isInCall = true
    currentCallDescriptor.remainingCount = scheduledCallIndex
  }

  if(expectingResults) {
    ({ value, done } = it.next(resultsGenerator(scheduledCalls)))
    expectingResults = false
    scheduledCalls = []
  }
}

const bfsify = (generator) => function(...args) {
  return bfsExhaust(generator(...args))
}

function dfsExhaust(it) {
  let scheduledCalls = []
  let expectingResults = false
  const resultsGenerator = function*(internalCalls) {
    for(const call of internalCalls) {
      // Proceed depth first
      const returnValue = dfsExhaust(call)
      yield returnValue
    }
  }
  while(true) {
    let value, done
    if(expectingResults) {
      ({ value, done } = it.next(resultsGenerator(scheduledCalls)))
      expectingResults = false
      scheduledCalls = []
    } else {
      ({ value, done } = it.next())
    }
    if(done) {
      return value
    } else if(value[scheduleCall]) {
      scheduledCalls.push(value[scheduleCall])
    } else if(value[debugMessage]) {
      console.log(value[debugMessage])
    } else if(value[receiveCalls]) {
      expectingResults = true
    }
  }
}

const dfsify = (generator) => function(...args) {
  return dfsExhaust(generator(...args))
}

function *verify(objectOrValue, path) {
  yield { [debugMessage]: `Starting ${path}` }
  if(typeof objectOrValue !== "object") {
    const success = objectOrValue < 11
    yield { [debugMessage]: `Comparing ${objectOrValue}` }
    return { offendingValues: success ? [] : [{ path, value: objectOrValue}] }
  }

  // Schedule computation
  for(const [key, value] of Object.entries(objectOrValue)) {
    yield { [scheduleCall]: verify(value, `${path}.${key}`) }
  }

  // Receive computed values
  const callReturns = yield { [receiveCalls]: true }
  let offendingValues = []
  for(const callReturn of callReturns) {
    console.log({ path, callReturn })
    offendingValues = offendingValues.concat(callReturn.offendingValues)
  }

  yield { [debugMessage]: `Ending ${path}` }
  return { offendingValues }
}

const bfsVerify = bfsify(verify)
const dfsVerify = dfsify(verify)


const tree = { a0: { a00: 13, a01: { a010: 17, a011: 9 } }, a1: 15, a2: { a20: 4, a21: 14 } }
console.log("BFS")
console.log("bfsVerify", bfsVerify(tree, ""))
console.log("DFS")
console.log("dfsVerify", dfsVerify(tree, ""))