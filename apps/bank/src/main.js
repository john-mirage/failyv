import { data } from './data/data';
import { Account, PersonalAccount } from './scripts/classes/account';
import { LogList } from './scripts/classes/log-list';
import { Form } from './scripts/classes/form';
import { Tab } from './scripts/classes/tab';
import { TabList } from './scripts/classes/tab-list';
import { Dropdown } from './scripts/classes/dropdown';
import { Filter } from './scripts/classes/filter';
import { FilterList } from './scripts/classes/filter-list';
import { FavoriteAccount } from './scripts/classes/favorite-account';
import { FavoriteAccountList } from './scripts/classes/favorite-account-list';
import { FavoriteAccountEditList } from './scripts/classes/favorite-account-edit-list';
import { FavoriteAccountPasteList } from './scripts/classes/favorite-account-paste-list';
import { View } from './scripts/classes/view';
import { ViewSwitcher } from './scripts/classes/view-switcher';
import { ThemeSwitch } from './scripts/classes/theme-switch';

const AMOUNT_REGEX = /^[1-9]\d*$/;
const ACCOUNT_NUM_REGEX = /^[0-9]{10}$/;

const personalTransferAccountNumberInput = document.getElementById(
  'personal-transfer-account-number-input'
);

/*------------------------------------*\
  App theme
\*------------------------------------*/

function setAppTheme(bank) {
  switch (bank) {
    case 'fleeca':
      document.documentElement.classList.add('fleeca');
      break;
    case 'maze':
      document.documentElement.classList.add('maze');
      break;
    default:
      throw new Error('The theme is not valid');
  }
}

setAppTheme(data.bank);

/*------------------------------------*\
  Personal account
\*------------------------------------*/

function getCurrentFormattedDate() {
  const date = new Date();
  return date.toISOString();
}

const personalAccount = new PersonalAccount(
  data.account.personal,
  document.getElementById('personal-account-owner'),
  document.getElementById('personal-account-number'),
  document.getElementById('personal-account-balance')
);

const personalLogList = new LogList(
  data.account.personal.logs,
  document.getElementById('personal-log-list')
);

const personalOperationLogList = new LogList(
  data.account.personal.logs.filter((log) => log.type === 'operation'),
  document.getElementById('personal-operation-log-list')
);

const personalFavoriteAccountForm = new Form(
  [
    document.getElementById('personal-favorite-account-name-input'),
    document.getElementById('personal-favorite-account-number-input'),
  ],
  document.getElementById('personal-favorite-account-form'),
  document.getElementById('personal-favorite-account-form-button')
);

const personalDepositForm = new Form(
  [document.getElementById('personal-deposit-amount-input')],
  document.getElementById('personal-deposit-form'),
  document.getElementById('personal-deposit-form-button')
);

const personalWithdrawForm = new Form(
  [document.getElementById('personal-withdraw-amount-input')],
  document.getElementById('personal-withdraw-form'),
  document.getElementById('personal-withdraw-form-button')
);

const personalTransferForm = new Form(
  [
    document.getElementById('personal-transfer-amount-input'),
    personalTransferAccountNumberInput,
    document.getElementById('personal-transfer-reference-input'),
  ],
  document.getElementById('personal-transfer-form'),
  document.getElementById('personal-transfer-form-button')
);

const personalFilterDropdown = new Dropdown(
  document.getElementById('personal-filter-dropdown')
);

const personalAllFilter = new Filter('Aucun', false);

const personalOperationFilter = new Filter('Opérations', 'operation');

const personalTransferFilter = new Filter('Transferts', 'transfer');

function setPersonalLogListFilter(filter) {
  personalLogList.filter = filter.value;
  personalLogList.reset();
  personalFilterDropdown.close();
  personalFilterDropdown.updateLabel(
    filter.value ? `filtre: ${filter.name}` : 'filtrer les résultats'
  );
}

const personalFilterList = new FilterList(
  [personalAllFilter, personalOperationFilter, personalTransferFilter],
  document.getElementById('personal-filter-list'),
  setPersonalLogListFilter
);

const accounts = data.account.personal.favoriteAccounts.map(
  (favoriteAccount) => {
    return new FavoriteAccount(favoriteAccount.name, favoriteAccount.number);
  }
);

const favoriteAccountList = new FavoriteAccountList(accounts);

function deleteFavoriteAccount(favoriteAccount) {
  favoriteAccountList.deleteFavoriteAccount(favoriteAccount);
  favoriteAccountEditList.reset();
}

function checkTransferForm() {
  personalTransferForm.checkFields();
}

function editFavoriteAccount(favoriteAccount, form, index) {
  const formData = new FormData(form.formElement);
  const newFavoriteAccount = new FavoriteAccount(
    formData.get('name'),
    formData.get('number')
  );
  favoriteAccountList.editFavoriteAccount(newFavoriteAccount, index);
  favoriteAccountEditList.reset();
}

const favoriteAccountEditList = new FavoriteAccountEditList(
  favoriteAccountList,
  editFavoriteAccount,
  deleteFavoriteAccount
);

const favoriteAccountPasteList = new FavoriteAccountPasteList(
  favoriteAccountList,
  personalTransferAccountNumberInput,
  checkTransferForm
);

function showPersonalView() {
  tabList.setActiveTab(personalTab);
  viewSwitcher.switch(personalView);
}

function showPersonalOperationView() {
  tabList.setActiveTab(personalOperationTab);
  viewSwitcher.switch(personalOperationView);
}

function showPersonalTransferView() {
  tabList.setActiveTab(personalTransferTab);
  viewSwitcher.switch(personalTransferView);
}

const personalView = new View(
  document.getElementById('personal-view'),
  personalFilterDropdown,
  personalFilterList,
  personalLogList,
  favoriteAccountEditList
);

const personalOperationView = new View(
  document.getElementById('personal-operation-view'),
  false,
  false,
  personalOperationLogList,
  false
);

const personalTransferView = new View(
  document.getElementById('personal-transfer-view'),
  false,
  false,
  false,
  favoriteAccountPasteList
);

const viewSwitcher = new ViewSwitcher(personalView);

const personalTab = new Tab('mon compte', 'personal', showPersonalView);

const personalOperationTab = new Tab(
  'opération',
  'personal-operation',
  showPersonalOperationView
);

const personalTransferTab = new Tab(
  'transfert',
  'transfer',
  showPersonalTransferView
);

const tabList = new TabList(
  [personalTab, personalOperationTab, personalTransferTab],
  document.getElementById('tab-list')
);

const personalThemeButton = document.getElementById('personal-theme-button');

const themeSwitch = new ThemeSwitch(personalThemeButton);

function addFavoriteAccount(event) {
  event.preventDefault();
  const formData = new FormData(personalFavoriteAccountForm.formElement);
  const accountName = formData.get('name');
  const accountNumber = formData.get('number');
  if (
    typeof accountName === 'string' &&
    typeof accountNumber === 'string' &&
    accountName.length > 0 &&
    ACCOUNT_NUM_REGEX.test(accountNumber)
  ) {
    const newAccount = new FavoriteAccount(accountName, accountNumber);
    const accountListIsNotFull =
      favoriteAccountList.favoriteAccounts.length < 5;
    const accountIsNotInTheList =
      favoriteAccountList.favoriteAccounts.findIndex(
        (favoriteAccount) => favoriteAccount.number === newAccount.number
      ) === -1;
    if (accountListIsNotFull && accountIsNotInTheList) {
      favoriteAccountList.addFavoriteAccount(newAccount);
      favoriteAccountEditList.reset();
      personalFavoriteAccountForm.reset();
    } else if (!accountListIsNotFull) {
      console.warn('favorite account error (the list is full 5/5)');
    } else if (!accountIsNotInTheList) {
      console.warn(
        'favorite account error (the account is already in the list)'
      );
    }
  } else {
    console.warn('favorite account submit error');
  }
}

function depositToPersonalAccount(event) {
  event.preventDefault();
  const formData = new FormData(personalDepositForm.formElement);
  const amount = formData.get('amount');
  if (typeof amount === 'string' && AMOUNT_REGEX.test(amount)) {
    const depositAmount = Number(amount);
    if (personalAccount.cash > depositAmount) {
      const log = {
        label: 'Dépot',
        amount: depositAmount,
        date: getCurrentFormattedDate(),
        reference: 'Dépot sur votre compte',
        type: 'operation',
      };
      personalLogList.addLog(log);
      if (tabList.activeTab.name === 'personal') {
        personalLogList.reset();
      }
      personalOperationLogList.addLog(log);
      if (tabList.activeTab.name === 'personal-operation') {
        personalOperationLogList.reset();
      }
      personalAccount.cash -= depositAmount;
      personalAccount.balance += depositAmount;
      personalAccount.displayBalance();
      personalDepositForm.reset();
    } else {
      console.warn('deposit error (not enough cash)');
    }
  } else {
    console.warn('deposit submit error');
  }
}

function depositAllToPersonalAccount() {
  if (personalAccount.cash > 0) {
    const log = {
      label: 'Dépot',
      amount: personalAccount.cash,
      date: getCurrentFormattedDate(),
      reference: 'Dépot sur votre compte',
      type: 'operation',
    };
    personalLogList.addLog(log);
    if (tabList.activeTab.name === 'personal') {
      personalLogList.reset();
    }
    personalOperationLogList.addLog(log);
    if (tabList.activeTab.name === 'personal-operation') {
      personalOperationLogList.reset();
    }
    personalAccount.cash = 0;
  } else {
    console.warn('deposit all error (not enough cash)');
  }
}

function withdrawToPersonalAccount(event) {
  event.preventDefault();
  const formData = new FormData(personalWithdrawForm.formElement);
  const amount = formData.get('amount');
  if (typeof amount === 'string' && AMOUNT_REGEX.test(amount)) {
    const withdrawAmount = Number(amount);
    if (personalAccount.balance >= withdrawAmount) {
      const log = {
        label: 'Retrait',
        amount: -withdrawAmount,
        date: getCurrentFormattedDate(),
        reference: 'Retrait depuis votre compte',
        type: 'operation',
      };
      personalLogList.addLog(log);
      if (tabList.activeTab.name === 'personal') {
        personalLogList.reset();
      }
      personalOperationLogList.addLog(log);
      if (tabList.activeTab.name === 'personal-operation') {
        personalOperationLogList.reset();
      }
      personalAccount.cash += withdrawAmount;
      personalAccount.balance -= withdrawAmount;
      personalAccount.displayBalance();
      personalWithdrawForm.reset();
    } else {
      console.warn('withdraw error (not enough money)');
    }
  } else {
    console.warn('withdraw submit error');
  }
}

function transferToAccount(event) {
  event.preventDefault();
  const formData = new FormData(personalTransferForm.formElement);
  const amount = formData.get('amount');
  const reference = formData.get('reference');
  const number = formData.get('number');
  if (
    typeof amount === 'string' &&
    typeof reference === 'string' &&
    typeof number === 'string' &&
    AMOUNT_REGEX.test(amount) &&
    reference.length > 0 &&
    ACCOUNT_NUM_REGEX.test(number)
  ) {
    const transferAmount = Number(amount);
    if (personalAccount.balance >= transferAmount) {
      const log = {
        label: 'Transfert',
        amount: -transferAmount,
        date: getCurrentFormattedDate(),
        reference: reference,
        type: 'operation',
      };
      personalLogList.addLog(log);
      if (tabList.activeTab.name === 'personal') {
        personalLogList.reset();
      }
      personalAccount.balance -= transferAmount;
      personalAccount.displayBalance();
      personalTransferForm.reset();
    } else {
      console.warn('transfer error (not enough money)');
    }
  } else {
    console.warn('transfer submit error');
  }
}

const personalAllDepositButton = document.getElementById(
  'personal-all-deposit-button'
);

personalFavoriteAccountForm.formElement.addEventListener(
  'submit',
  addFavoriteAccount
);
personalDepositForm.formElement.addEventListener(
  'submit',
  depositToPersonalAccount
);
personalAllDepositButton.addEventListener('click', depositAllToPersonalAccount);
personalWithdrawForm.formElement.addEventListener(
  'submit',
  withdrawToPersonalAccount
);
personalTransferForm.formElement.addEventListener('submit', transferToAccount);

/*------------------------------------*\
  Enterprise & Offshore accounts
\*------------------------------------*/

if (data.hasEnterprise) {
  const enterpriseAccount = new Account(
    data.account.enterprise,
    document.getElementById('enterprise-account-owner'),
    document.getElementById('enterprise-account-balance')
  );

  const enterpriseLogList = new LogList(
    data.account.enterprise.logs,
    document.getElementById('enterprise-log-list')
  );

  const enterpriseFilterDropdown = new Dropdown(
    document.getElementById('enterprise-filter-dropdown')
  );

  const enterpriseAllFilter = new Filter('Aucun', false);

  const enterpriseOperationFilter = new Filter('Opérations', 'operation');

  const enterpriseTransferFilter = new Filter('Transferts', 'transfer');

  function setEnterpriseLogListFilter(filter) {
    enterpriseLogList.filter = filter.value;
    enterpriseLogList.reset();
    enterpriseFilterDropdown.close();
    enterpriseFilterDropdown.updateLabel(
      filter.value ? `filtre: ${filter.name}` : 'filtrer les résultats'
    );
  }

  const enterpriseFilterList = new FilterList(
    [enterpriseAllFilter, enterpriseOperationFilter, enterpriseTransferFilter],
    document.getElementById('enterprise-filter-list'),
    setEnterpriseLogListFilter
  );

  const enterpriseDepositForm = new Form(
    [document.getElementById('enterprise-deposit-amount-input')],
    document.getElementById('enterprise-deposit-form'),
    document.getElementById('enterprise-deposit-form-button')
  );

  const enterpriseWithdrawForm = new Form(
    [document.getElementById('enterprise-withdraw-amount-input')],
    document.getElementById('enterprise-withdraw-form'),
    document.getElementById('enterprise-withdraw-form-button')
  );

  function showEnterpriseView() {
    tabList.setActiveTab(enterpriseTab);
    viewSwitcher.switch(enterpriseView);
  }

  const enterpriseTab = new Tab('entreprise', 'enterprise', showEnterpriseView);

  tabList.addTab(enterpriseTab);

  const enterpriseView = new View(
    document.getElementById('enterprise-view'),
    enterpriseFilterDropdown,
    enterpriseFilterList,
    enterpriseLogList,
    false
  );

  function depositToEnterpriseAccount(event) {
    event.preventDefault();
    const formData = new FormData(enterpriseDepositForm.formElement);
    const amount = formData.get('amount');
    if (typeof amount === 'string' && AMOUNT_REGEX.test(amount)) {
      const depositAmount = Number(amount);
      if (personalAccount.cash > depositAmount) {
        const log = {
          label: 'Dépot',
          amount: depositAmount,
          date: getCurrentFormattedDate(),
          reference: 'Dépot sur votre compte',
          type: 'operation',
        };
        enterpriseLogList.addLog(log);
        if (tabList.activeTab.name === 'enterprise') {
          enterpriseLogList.reset();
        }
        personalAccount.cash -= depositAmount;
        enterpriseAccount.balance += depositAmount;
        enterpriseAccount.displayBalance();
        enterpriseDepositForm.reset();
      } else {
        console.warn('enterprise deposit error (not enough cash)');
      }
    } else {
      console.warn('enterprise deposit submit error');
    }
  }

  function depositAllToEnterpriseAccount() {
    if (personalAccount.cash > 0) {
      const log = {
        label: 'Dépot',
        amount: personalAccount.cash,
        date: getCurrentFormattedDate(),
        reference: "Dépot le compte de l'entreprise",
        type: 'operation',
      };
      enterpriseLogList.addLog(log);
      if (tabList.activeTab.name === 'enterprise') {
        enterpriseLogList.reset();
      }
      personalAccount.cash = 0;
    } else {
      console.warn('enterprise deposit all error (not enough cash)');
    }
  }

  function withdrawToEnterpriseAccount(event) {
    event.preventDefault();
    const formData = new FormData(enterpriseWithdrawForm.formElement);
    const amount = formData.get('amount');
    if (typeof amount === 'string' && AMOUNT_REGEX.test(amount)) {
      const withdrawAmount = Number(amount);
      if (enterpriseAccount.balance > withdrawAmount) {
        const log = {
          label: 'Retrait',
          amount: -withdrawAmount,
          date: getCurrentFormattedDate(),
          reference: "Retrait depuis le compte de l'entreprise",
          type: 'operation',
        };
        enterpriseLogList.addLog(log);
        if (tabList.activeTab.name === 'enterprise') {
          enterpriseLogList.reset();
        }
        personalAccount.cash += withdrawAmount;
        enterpriseAccount.balance -= withdrawAmount;
        enterpriseAccount.displayBalance();
        enterpriseWithdrawForm.reset();
      } else {
        console.warn('enterprise withdraw error (not enough money)');
      }
    } else {
      console.warn('enterprise withdraw submit error');
    }
  }

  const enterpriseAllDepositButton = document.getElementById(
    'enterprise-all-deposit-button'
  );

  enterpriseDepositForm.formElement.addEventListener(
    'submit',
    depositToEnterpriseAccount
  );
  enterpriseWithdrawForm.formElement.addEventListener(
    'submit',
    withdrawToEnterpriseAccount
  );
  enterpriseAllDepositButton.addEventListener(
    'click',
    depositAllToEnterpriseAccount
  );

  if (data.hasOffshore) {
    const offshoreAccount = new Account(
      data.account.offshore,
      document.getElementById('offshore-account-owner'),
      document.getElementById('offshore-account-balance')
    );

    const offshoreLogList = new LogList(
      data.account.offshore.logs,
      document.getElementById('offshore-log-list')
    );

    const offshoreFilterDropdown = new Dropdown(
      document.getElementById('offshore-filter-dropdown')
    );

    const offshoreAllFilter = new Filter('Aucun', false);

    const offshoreOperationFilter = new Filter('Opérations', 'operation');

    const offshoreTransferFilter = new Filter('Transferts', 'transfer');

    function setOffshoreLogListFilter(filter) {
      offshoreLogList.filter = filter.value;
      offshoreLogList.reset();
      offshoreFilterDropdown.close();
      offshoreFilterDropdown.updateLabel(
        filter.value ? `filtre: ${filter.name}` : 'filtrer les résultats'
      );
    }

    const offshoreFilterList = new FilterList(
      [offshoreAllFilter, offshoreOperationFilter, offshoreTransferFilter],
      document.getElementById('offshore-filter-list'),
      setOffshoreLogListFilter
    );

    const offshoreDepositForm = new Form(
      [document.getElementById('offshore-deposit-amount-input')],
      document.getElementById('offshore-deposit-form'),
      document.getElementById('offshore-deposit-form-button')
    );

    function showOffshoreView() {
      tabList.setActiveTab(offshoreTab);
      viewSwitcher.switch(offshoreView);
    }

    const offshoreTab = new Tab('offshore', 'offshore', showOffshoreView, true);

    const offshoreTabButton = document.getElementById('offshore-tab-button');

    const offshoreView = new View(
      document.getElementById('offshore-view'),
      offshoreFilterDropdown,
      offshoreFilterList,
      offshoreLogList,
      false
    );

    function depositToOffshoreAccount(event) {
      event.preventDefault();
      const formData = new FormData(offshoreDepositForm.formElement);
      const amount = formData.get('amount');
      if (typeof amount === 'string' && AMOUNT_REGEX.test(amount)) {
        const depositAmount = Number(amount);
        if (personalAccount.cash > depositAmount) {
          const log = {
            label: 'Dépot',
            amount: depositAmount,
            date: getCurrentFormattedDate(),
            reference: 'Dépot sur le compte offshore',
            type: 'operation',
          };
          offshoreLogList.addLog(log);
          if (tabList.activeTab.name === 'offshore') {
            offshoreLogList.reset();
          }
          personalAccount.cash -= depositAmount;
          offshoreAccount.balance += depositAmount;
          offshoreAccount.displayBalance();
          offshoreDepositForm.reset();
        } else {
          console.warn('offshore deposit error (not enough cash)');
        }
      } else {
        console.warn('offshore deposit submit error');
      }
    }

    function depositAllToOffshoreAccount() {
      if (personalAccount.cash > 0) {
        const log = {
          label: 'Dépot',
          amount: personalAccount.cash,
          date: getCurrentFormattedDate(),
          reference: 'Dépot sur le compte offshore',
          type: 'operation',
        };
        offshoreLogList.addLog(log);
        if (tabList.activeTab.name === 'offshore') {
          offshoreLogList.reset();
        }
        personalAccount.cash = 0;
        offshoreAccount.displayBalance();
      } else {
        console.warn('offshore deposit all error (not enough cash)');
      }
    }

    const offshoreAllDepositButton = document.getElementById(
      'offshore-all-deposit-button'
    );

    offshoreTabButton.addEventListener('click', showOffshoreView);
    offshoreDepositForm.formElement.addEventListener(
      'submit',
      depositToOffshoreAccount
    );
    offshoreAllDepositButton.addEventListener(
      'click',
      depositAllToOffshoreAccount
    );
  } else {
    const offshoreView = document.getElementById('offshore-view');
    const offshoreTabButton = document.getElementById('offshore-tab-button');
    offshoreView.remove();
    offshoreTabButton.remove();
  }
} else {
  const enterpriseView = document.getElementById('enterprise-view');
  const offshoreView = document.getElementById('offshore-view');
  const offshoreTabButton = document.getElementById('offshore-tab-button');
  enterpriseView.remove();
  offshoreView.remove();
  offshoreTabButton.remove();
}

/*------------------------------------*\
  Load app
\*------------------------------------*/

const app = document.getElementById('app');

setTimeout(() => {
  app.classList.replace('app--loading', 'app--loaded');
}, 1000);
