// **must init all the fields before calling this method
const getPaths = (formData, parentPath = []) => {
  if (!formData) return [];
  return Object.keys(formData).reduce((paths, key) => {
    const path = [...parentPath, key]
    const value = formData[key]
    if (value && typeof value === 'object') {
      return [...paths, ...getPaths(value, path)]
    }
    return [...paths, path]
  }, [])
}

// **must init all the fields before calling this method
const validateAndScrollToError = async (form, path=[]) => {
  const targetObj = form.getFieldValue(path);
  const pathsToValidate = getPaths(targetObj, path);

  try {
    const data = await form.validateFields();

    return data
  } catch (error) {
    for (const errorField of error.errorFields) {
      const sliceString = errorField.name.slice(0, path.length).toString()
      const pathString = path.toString()

      if (errorField.name.slice(0, path.length).toString() === path.toString()) {
        form.scrollToField(errorField.name, {
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
          scrollMode: 'if-needed',
        });
        throw error
      }
    }
    return null
  }
  // const targetObj = form.getFieldValue(path);
  // const pathsToValidate = getPaths(targetObj, path);
  //
  // try {

  //   const data = await form.validateFields(pathsToValidate);

  //   return data
  // } catch (error) {
  //   form.scrollToField(error.errorFields[0].name, {
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'nearest',
  //     scrollMode: 'if-needed',
  //   });
  //   return error
  // }
}
export default {
  getPaths, validateAndScrollToError
}

