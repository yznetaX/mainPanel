import { generateId, mergeArrays } from "./utils";
export class Chain {
  constructor() {
    this.id = generateId();
    this.text = "";
    this.url = "";
    this.sectionTitle = "";
    this.replies = [];
    this.dialogs = [];
    this.level = 0;
  }
}

export class Reply {
  constructor() {
    this.id = generateId();
    this.text = "";
    this.next = new Chain()
    this.selected = null;
  }
}

export class Dialog {
  constructor(op, val) {
    this.id = generateId();
    this.text = "";
    this.option = op;
    this.values = val;
  }
}

export var tree = new Chain();

function findUrls(chain) {
  let urls = [];
  if (chain) {
    chain.dialogs.forEach((dialog) => {
      if (dialog.values && dialog.values.url && dialog.values.url.length > 0)
        urls.push(dialog.values.url);
    });

    chain.replies.forEach((reply) => {
      let nextUrls = findUrls(reply.next);
      if (nextUrls.length > 0) urls = mergeArrays(urls, nextUrls);
    });
  }
  return urls;
}

function findIds(chain) {
  let id = [];
  if (chain) {
    chain.dialogs.forEach((dialog) => {
      if (dialog.id && dialog.id.length > 0)
        id.push(dialog.id);
    });

    chain.replies.forEach((reply) => {
      let nextIds = findIds(reply.next);
      if (nextIds.length > 0) id = mergeArrays(id, nextIds);
    });
  }
  return id;
}
function findChainUrls(chain) {
  let chainUrl = [];
  if (chain) {
      chainUrl.push(chain.url)
    chain.replies.forEach((reply) => {
      let nextChainUrls = findChainUrls(reply.next);
      if (nextChainUrls.length > 0) chainUrl = mergeArrays(chainUrl, nextChainUrls);
    });
  }
  return chainUrl;
}

export const findDeletedUrls = function(oldChain, newChain) {
  let oldUrls = findUrls(oldChain);
  let newUrls = findUrls(newChain);
  if (oldUrls.length > 0) {
    return oldUrls.filter((url) => newUrls.indexOf(url) < 0);
  }
  return [];
};

export const findDeletedIds = function(oldChain, newChain) {
  let oldIds = findIds(oldChain);
  let newIds = findIds(newChain);
  if (oldIds.length > 0) {
    return oldIds.filter((id) => newIds.indexOf(id) < 0);
  }
  return [];
};
export const findDeletedChainUrls = function(oldChain, newChain) {
  let oldChainUrl = findChainUrls(oldChain);
  let newChainUrl = findChainUrls(newChain);
  if (oldChainUrl.length > 0) {
    return oldChainUrl.filter((url) => newChainUrl.indexOf(url) < 0);
  }
  return [];
};

function unselectChainReplies(chain) {
  if (!chain) return;
  for (let i = 0; i < chain.replies.length; i++) {
    let reply = chain.replies[i];
    reply.selected = false;
    unselectChainReplies(reply.next);
  }
}
export const applySelectionId = function(chain, selection) {
  // unselect all reply nodes
  unselectChainReplies(chain);
  // select replies
    selection.selected = true;
};

export const applySelection = function(chain, selection) {
  // unselect all reply nodes
  unselectChainReplies(chain);
  // select replies
  for (let i = 0; i < selection.length; i++) {
    let reply = selection[i];
    reply.selected = true;
  }
};

export class PlanService {
  constructor(chain, searchText, callback = null) {
    this.searchText = searchText;
    this.chain = chain;
    this.results = [];
    this.search(callback);
  }

  async search(callback = null) {
    this.results = [];
    if (!this.chain || !this.searchText) return;

    if (this.isChainMatchSearch(this.chain)) this.results.push([]);

    for (let i = 0; i < this.chain.replies.length; i++) {
      this.searchRecursive([this.chain.replies[i]]);
    }
    if (callback) callback(this);
  }

  searchRecursive(arry) {
    let reply = arry[arry.length - 1];
    if (this.isReplyMatchSearch(reply)) {
      this.results.push(arry);
    }

    for (let i = 0; i < reply.next.replies.length; i++) {
      var a = [...arry];
      a.push(reply.next.replies[i]);
      this.searchRecursive(a);
    }
  }

  isReplyMatchSearch(reply) {
    return (
      this.isTextMatchSearch(reply.id) ||
      this.isTextMatchSearch(reply.text) ||
      this.isChainMatchSearch(reply.next)
    );
  }

  isChainMatchSearch(chain) {
    if (this.isTextMatchSearch(chain.id) || this.isTextMatchSearch(chain.text))
      return true;
    for (let i = 0; i < chain.dialogs.length; i++) {
      let dialog = chain.dialogs[i];
      if (this.isDialogMatchSearch(dialog)) return true;
    }
    return false;
  }

  isDialogMatchSearch(dialog) {
    return (
      this.isTextMatchSearch(dialog.id) || this.isTextMatchSearch(dialog.text)
    );
  }

  isTextMatchSearch(text) {
    return text && text.toLowerCase().includes(this.searchText.toLowerCase());
  }
}

export class SearchService {
  constructor(chain, searchText, callback = null) {
    this.searchText = searchText;
    this.chain = chain;
    this.results = [];
    this.search(callback);
  }

  async search(callback = null) {
    this.results = [];
    if (!this.chain || !this.searchText) return;

    if (this.isChainMatchSearch(this.chain)) this.results.push([]);

    for (let i = 0; i < this.chain.replies.length; i++) {
      this.searchRecursive([this.chain.replies[i]]);
    }
    if (callback) callback(this);
  }

  searchRecursive(arry) {
    let reply = arry[arry.length - 1];
    if (this.isReplyMatchSearch(reply)) {
      this.results.push(arry);
    }

    for (let i = 0; i < reply.next.replies.length; i++) {
      var a = [...arry];
      a.push(reply.next.replies[i]);
      this.searchRecursive(a);
    }
  }

  isReplyMatchSearch(reply) {
    return (
      this.isTextMatchSearch(reply.id) ||
      this.isTextMatchSearch(reply.text) ||
      this.isChainMatchSearch(reply.next)
    );
  }

  isChainMatchSearch(chain) {
    if (this.isTextMatchSearch(chain.id) || this.isTextMatchSearch(chain.text))
      return true;
    for (let i = 0; i < chain.dialogs.length; i++) {
      let dialog = chain.dialogs[i];
      if (this.isDialogMatchSearch(dialog)) return true;
    }
    return false;
  }

  isDialogMatchSearch(dialog) {
    return (
      this.isTextMatchSearch(dialog.id) || this.isTextMatchSearch(dialog.text)
    );
  }

  isTextMatchSearch(text) {
    return text && text.toLowerCase().includes(this.searchText.toLowerCase());
  }
}

export class ValidateService {
  constructor(chain, callback = null) {
    this.chain = chain;
    this.invalidPath = null;
    this.validate(callback);
  }

  async validate(callback = null) {
    this.invalidPath = null;
    if (!this.chain) return;
    if (!this.isChainValid(this.chain)) {
      this.invalidPath = [];
      if (callback) callback(this);
      return;
    }

    for (let i = 0; i < this.chain.replies.length; i++) {
      this.validateRecursive([this.chain.replies[i]]);
    }

    if (callback) callback(this);
  }

  validateRecursive(arry) {
    let reply = arry[arry.length - 1];
    if (!this.isReplyValid(reply)) {
      this.invalidPath = arry;
      return;
    }

    for (let i = 0; i < reply.next.replies.length; i++) {
      var a = [...arry];
      a.push(reply.next.replies[i]);
      this.validateRecursive(a);
    }
  }

  isReplyValid(reply) {
    if (!reply.text || reply.text.length == 0) return false;

    if (
      reply.next &&
      reply.next.replies &&
      reply.next.replies.length > 0 &&
      !this.isChainValid(reply.next)
    )
      return false;

    return true;
  }

  isChainValid(chain) {
    return (chain.text && chain.text.length > 0) || (chain.url && chain.url.length > 0);
  }
}
