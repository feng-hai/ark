const mutations = {

  setUser(state, user) {
    state.name = user.name;
    state.token = user.token;
  }
}
export default mutations;
