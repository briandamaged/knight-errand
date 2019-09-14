
class Location {
  constructor({name, description}) {
    this.name = name;
    this.description = description;
  }

  describe() {
    return `
${this.name}
-----------------
${this.description}
    `;
  }
}

module.exports = exports = Location;
