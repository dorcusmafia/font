define(['jquery', 'knockout', 'underscore', 'sbufConfig', 'sbufHelpers', 'utils', 'ko.mapping'], function ($, ko, _, sbufConfig, sbufHelpers, utils) {
    var usersViewModel = function () {
        var self = this;
        self.SelectedRoleFilter = ko.observable('');
        self.IsAdministrator = ko.observable(false);
        self.RolesFilter = ko.observableArray([
            { Name: 'Sökande', Value: 1 },
            { Name: 'Projektledare', Value: 2 }
        ]);
        self.Query = ko.observable({
            FreeText: ko.observable(''),
            IsAdministrator: self.IsAdministrator,
            Roles: ko.observableArray([]),
            Tags: ko.observableArray([]),
            Categories: ko.observableArray([]),
            Name: ko.observable(''),
            Address1: ko.observable(''),
            Address2: ko.observable(''),
            Address3: ko.observable(''),
            Company: ko.observable(''),
            RolesFilter: self.SelectedRoleFilter,

            Committees: ko.observableArray([]),
            Email: ko.observable('')

        });
        self.CommunicationChannels = ko.observableArray([
            { Name: 'E-post', Value: 0 },
            { Name: 'Post', Value: 1 }
        ]);

        self.RolesFilter = ko.observableArray([
            { Name: 'Sökande', Value: 1 },
            { Name: 'Projektledare', Value: 2 }
        ]);

        self.Tags = ko.observableArray();
        self.TagsForSelectedUsers = ko.observableArray();
        self.Categories = ko.observableArray();
        self.Roles = ko.observableArray();
        self.Committees = ko.observableArray();
        // #7868
        self.Cases = ko.observableArray();
        self.SelectedCaseGuid = ko.observable();
        self.CaseSelected = ko.observable('');
        self.AllRoles = ko.observableArray([]);
        self.User = ko.observable().extend({ propertyUpdateCallback: self.saveUserProperty });

        self.CurrentCases = ko.observableArray([]);

        //[{ CaseNumber: "12312", Title: "The PROJECT", Users: [{ Role: '1', RoleName: 'Sökande', Former: 'Nisse Nissesson', isCurrent: false }, { Role: '2', Name: 'Projekledare', Former: 'Sara Sarasson', isCurrent: true }] }, { CaseNumber: "11111", Title: "NO TWO", Users: [{ Role: '1', Name: 'Sökande', Former: 'Nisse Nissesson', isCurrent: false }, { Role: '2', Name: 'Projekledare', Former: 'Sara Sarasson', isCurrent: false }] }]


        self.AvailableRoles =
        [
            { Role: '1', Name: 'Sökande', Former: '' },
            { Role: '2', Name: 'Projektledare', Former: '' } //,
            //{ Role: '3', Name: 'Administratör', Former: '' },
            //{ Role: '4', Name: 'Deltagare', Former: '' }
        ];

        self.SelectedRoles = ko.observableArray([]);

        self.CaseSelected.subscribe(function (newCase) {

            var userCases = newCase.UserCases;
            self.AllRoles([]);
            _.each(self.AvailableRoles,
                function (role) {

                    var roleHit = _.find(userCases,
                        function (uc) {
                            if (uc.Role == role.Role) {
                                return uc;
                            }
                        });

                    if (roleHit !== undefined) {

                        $.get(sbufConfig.settings.apiHost + "/Users/" + roleHit.UserId)
                            .done(function (user) {
                                role.Former = user.Name;
                                role.CaseId = roleHit.CaseId;
                                role.IsCurrent = roleHit.UserId == self.User().UserId();
                                self.AllRoles.push(role);
                            });
                    } else {
                        role.IsCurrent = true;
                        self.AllRoles.push(role);
                    }

                });
        });


        self.Users = ko.observableArray([]);
        self.OrderBy = ko.observable('Name');
        self.OrderByDirection = ko.observable('asc');
        self.userComparer = function (l, r) {
            var lVal, rVal;
            var property = self.OrderBy();
            if (property.indexOf('.') > 0) {
                property = property.split('.');
                lVal = l[property[0]];
                rVal = r[property[0]];
                for (var i = 1; i < property.length; i++) {
                    lVal = lVal[property[i]];
                    rVal = rVal[property[i]];
                }
            } else {
                lVal = l[property];
                rVal = r[property];
            }

            if (self.OrderByDirection() == 'asc') {
                return lVal > rVal ? 1 : -1;
            } else {
                return lVal < rVal ? 1 : -1;
            }
        };

        self.FlattenedUserCaseRoles = ko.computed(function () {

            if (!self.User()) return [];

            var roles = _.map($root.User().UserCases(), function (uc) { return uc.Role(); });

            if (roles === undefined || roles.length === 0)
                return [];

            var result = _.uniq(roles);

            return result;
        });

        self.SortedUsers = ko.pureComputed(function () {
            var sortedUsers = ko.mapping.toJS(self.Users()).sort(self.userComparer);

            for (var i = 0; i < sortedUsers.length; i++) {
                sortedUsers[i].FlattenedUserCases = [];
                var roles = _.map(sortedUsers[i].UserCases, function (uc) { return uc.Role; });

                if (roles !== undefined && roles.length > 0)
                    sortedUsers[i].FlattenedUserCases = _.uniq(roles);
            }

            return sortedUsers;
        })
            .extend({ throttle: 100 });
        self.orderBy = function (property) {
            if (self.OrderBy() == property) {
                self.OrderByDirection(self.OrderByDirection() == 'asc' ? 'desc' : 'asc');
            } else {
                self.OrderBy(property);
                self.OrderByDirection('asc');
            }
        };
        self.saveUserProperty = function (observable, property, newValue) {

            if (property == "Password" && newValue.length < 8) {
                $.growl({
                    title: 'Fel',
                    text: 'Lösenordet måste vara minst åtta tecken',
                    type: 'error',
                    delay: 0,
                    'class': 'growl-item'
                });
                return;
            }

            var user = ko.mapping.toJS(self.User());
            console.log('saving ' + property + ' for user ' + user.UserId, newValue);


            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users/' + user.UserId + '/' + property,
                type: 'POST',
                data: { '': newValue },
                success: function (user) {
                    console.log('updated', user);
                    $.growl({
                        title: 'Sparat',
                        text: sbufConfig.lang['userProperty' + property],
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                    //self.User().Roles(ko.mapping.fromJS(user.Roles)());

                    var match = ko.utils.arrayFirst(self.Users(),
                        function (item) {
                            return item.UserId() == self.User().UserId();
                        });
                    if (match) {
                        console.log('replacing');
                        self.Users.replace(match, self.User());
                        self.Users.valueHasMutated();
                    }
                },
                error: function (xhr) {
                    if (xhr.status == 400 && xhr.responseText.toLowerCase().indexOf('username') > 0) {
                        $.growl({
                            title: 'Fel',
                            text: 'En annan användare med samma användarnamn finns redan.',
                            type: 'error',
                            delay: 0,
                            'class': 'growl-item'
                        });
                    }
                    console.error('fail');
                }
            });
        };

        self.NewUser = ko.observable({
            Name: ko.observable(), //.extend({ required: true, maxlength: 255 }),
            Company: ko.observable(), //.extend({ required: true, maxlength: 255, message: 'Företag är obligatoriskt' }),
            Email: ko.observable(), //.extend({ required: true, maxlength: 255, type: 'email', message: 'E-post är obligatoriskt' }),
            Phone: ko.observable(),
            Username: ko.observable(),
            NotifyUser: ko.observable()
        });

        self.User = ko.observable().extend({ propertyUpdateCallback: self.saveUserProperty });

        self.SelectedUserIds = ko.observableArray([]);

        // Computed
        self.UserCount = ko.computed(function () {
            return self.Users().length;
        });
        self.UserCaseToAdd = ko.computed({
            read: function () {
                return [];
            },
            write: function () {
                if (self.User()) {
                    var roles = self.SelectedRoles();
                    var id = viewModel.CaseSelected().CaseId;
                    var currentCase = ko.utils.arrayFirst(viewModel.Cases(),
                        function (item) {
                            return item.CaseId == id;
                        });
                    var data = {
                        caseId: currentCase.CaseId,
                        userId: self.User().UserId(),
                        roles: roles
                    };

                    $.ajax({
                        url: sbufConfig.settings.apiHost + '/UserCases/' + data.userId,
                        type: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        success: function (data) {
                            console.log('Got', data);
                            var user = ko.mapping.fromJS(data);
                            $.growl({
                                title: 'Skapad',
                                text: 'Projektet och rollen har lagts till',
                                type: 'inverse',
                                delay: 3000,
                                'class': 'growl-item'
                            });
                            //self.Users.unshift(user);
                            //self.Users.isLoaded(true);
                            //$('#modal-user-create').modal('hide');
                            self.loadUser(user);

                            //$('#modal-user-card').modal('show');
                            //Close the grey div - #addusertoproject by empty the observables
                            //self.SelectedCaseGuid('');
                            self.CaseSelected('');
                            // Empty the roles ddl
                            self.SelectedRoles([]);
                        },
                        error: function () {
                            $.growl({
                                title: 'Ett fel uppstod',
                                text: 'Kunde inte rollen/projektet',
                                type: 'error',
                                delay: 0,
                                'class': 'growl-item'
                            });
                        }
                    });

                }
            }
        });
        self.UserAddress = ko.computed({
            read: function () {
                if (!self.User())
                    return "";

                var address = self.User().Address1() ? self.User().Address1() : '';
                if (self.User().Address2())
                    address += '\n' + self.User().Address2();
                if (self.User().Address3())
                    address += '\n' + self.User().Address3();

                return $.trim(address);
            },
            write: function (newValue) {
                if (self.User()) {
                    self.User().Address1(newValue);
                }
            }
        });
        self.UserCategoryIds = ko.computed({
            read: function () {
                if (!self.User())
                    return [];

                var ids = ko.utils.arrayMap(ko.mapping.toJS(self.User().Categories()),
                    function (item) {
                        return item.CategoryId;
                    });
                return ids;
            },
            write: function (ids) {
                var items = ko.utils.arrayMap(ids,
                    function (id) {
                        return ko.utils.arrayFirst(self.Categories(),
                            function (item) {
                                return item.CategoryId == id;
                            });
                    });
                self.User().Categories(items);
            }
        });
        self.UserTagIds = ko.computed({
            read: function () {
                if (!self.User())
                    return [];

                var ids = ko.utils.arrayMap(ko.mapping.toJS(self.User().Tags()),
                    function (item) {
                        return item.TagId;
                    });
                return ids;
            },
            write: function (ids) {
                console.log('ids', ids);
                var items = ko.utils.arrayMap(ids,
                    function (id) {
                        return ko.utils.arrayFirst(self.Tags(),
                            function (item) {
                                return item.TagId == id;
                            });
                    });
                self.User().Tags(items);
            }
        });
        self.UserRoleIds = ko.computed({
            read: function () {
                if (!self.User())
                    return [];

                var ids = ko.utils.arrayMap(ko.mapping.toJS(self.User().Roles()),
                    function (item) {
                        return item.RoleId;
                    });
                return ids;
            },
            write: function (ids) {
                var items = ko.utils.arrayMap(ids,
                    function (id) {
                        return ko.utils.arrayFirst(self.Roles(),
                            function (item) {
                                return item.RoleId == id;
                            });
                    });
                self.User().Roles(items);
            }
        });
        self.UserCommitteeIds = ko.computed({
            read: function () {
                if (!self.User())
                    return [];

                var ids = ko.utils.arrayMap(ko.mapping.toJS(self.User().Committees()),
                    function (item) {
                        return item.CommitteeId;
                    });
                console.log('returning ids', ids);
                return ids;
            },
            write: function (ids) {
                var items = ko.utils.arrayMap(ids,
                    function (id) {
                        return ko.utils.arrayFirst(self.Committees(),
                            function (item) {
                                return item.CommitteeId == id;
                            });
                    });
                self.User().Committees(items);
            }
        });

        self.GetRole = function (roleId) {

            if (roleId !== null) {
                if (roleId == 1) {
                    roleId = "Sökande";
                    return roleId;
                } else if (roleId == 2) {
                    roleId = "Projektledare";
                    return roleId;
                } else if (roleId == 3) {
                    roleId = "Administratör";
                    return roleId;
                } else if (roleId == 4) {
                    roleId = "Participant";
                    return roleId;
                }

            }
        };

        // Methods
        self.removeTagsFromSelectedUsers = function () {
            ko.utils.arrayForEach(self.TagsForSelectedUsers(),
                function (tagName) {
                    $.ajax({
                        url: sbufConfig.settings.apiHost + '/Tags/' + tagName + '/Users',
                        type: 'DELETE',
                        data: {
                            '': ko.utils.arrayMap(self.SelectedUserIds(),
                                function (id) {
                                    return {
                                        UserId:
                                            id
                                    };
                                })
                        },
                        success: function (tag) {
                            var matches = ko.utils.arrayFilter(self.Users(),
                                function (user) {
                                    return ko.utils.arrayFirst(self.SelectedUserIds(),
                                            function (id) {
                                                return id === user.UserId();
                                            }) !==
                                        null;
                                });
                            $(matches)
                                .each(function (i, user) {
                                    user.Tags.remove(function (userTag) { return userTag.TagId() == tag.TagId; });
                                });
                        },
                        error: function (xhr) {
                            console.error(xhr);
                        }
                    });
                });
            self.TagsForSelectedUsers([]);
        };

        self.addTagsForSelectedUsers = function () {
            ko.utils.arrayForEach(self.TagsForSelectedUsers(),
                function (tagName) {
                    $.ajax({
                        url: sbufConfig.settings.apiHost + '/Tags',
                        type: 'POST',
                        data: { Name: tagName },
                        success: function (tag) {
                            $.ajax({
                                url: sbufConfig.settings.apiHost + '/Tags/' + tag.Name + '/Users',
                                type: 'POST',
                                data: {
                                    '': ko.utils.arrayMap(self.SelectedUserIds(),
                                        function (id) { return { UserId: id }; })
                                },
                                success: function () {
                                    var matches = ko.utils.arrayFilter(self.Users(),
                                        function (user) {
                                            return ko.utils.arrayFirst(self.SelectedUserIds(),
                                                    function (id) {
                                                        return id === user.UserId();
                                                    }) !==
                                                null;
                                        });
                                    $(matches)
                                        .each(function (i, user) {
                                            user.Tags.push(ko.mapping.fromJS(tag));
                                        });
                                },
                                error: function (xhr) {
                                    console.error(xhr);
                                }
                            });
                        },
                        error: function () {
                        }
                    });
                });
            self.TagsForSelectedUsers([]);
        };

        self.createUser = function (data, event) {
            var form = $(event.target).closest('form').parsley();
            form.validate();
            if (!form.isValid()) {
                return;
            }

            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users',
                type: 'POST',
                data: ko.mapping.toJS(self.NewUser()),
                success: function (data) {
                    console.log('Got', data);
                    var user = ko.mapping.fromJS(data);
                    $.growl({
                        title: 'Skapad',
                        text: 'Användaren har skapats',
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                    self.Users.unshift(user);
                    self.Users.isLoaded(true);
                    $('#modal-user-create').modal('hide');
                    self.loadUser(user);
                    $('#modal-user-card').modal('show');
                },
                error: function () {
                    $.growl({
                        title: 'Ett fel uppstod',
                        text: 'Kunde inte skapa användaren',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                }
            });
        };

        self.loadUser = function (user) {
            if (user !== undefined) {
                $.when(sbufHelpers.loadObservable('/Users/' + ko.mapping.toJS(user).UserId,
                        self.User,
                        {
                            mapChildren: true
                        }))
                    .done(function () {

                        sbufHelpers.loadObservable('/UserCases/' + ko.mapping.toJS(user).UserId,
                            self.CurrentCases,
                            { mapChildren: false });

                    });
            }

        };

        self.ReplaceCurrentUserCase = function (usercase) {
            console.log(usercase);

            var caseToAdd = {
                CaseId: usercase.CaseId,
                UserId: self.User().UserId(),
                Role: usercase.Role
            };

            $.ajax({
                url: sbufConfig.settings.apiHost + '/UserCases/' + self.User().UserId(),
                type: 'POST',
                data: caseToAdd,
                success: function (returnedUserCase) {
                    console.log('Added usercase', returnedUserCase);
                    sbufHelpers.loadObservable('/UserCases/' + self.User().UserId(), self.CurrentCases, { mapChildren: false });
                    sbufHelpers.loadObservable('/cases/' + self.SelectedCaseGuid(), self.CaseSelected);
                    $.growl({
                        title: 'Tilldelad',
                        text: 'Rollen har tilldelats användaren',
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                    //self.SelectedCaseGuid('');
                },
                error: function () {
                    $.growl({
                        title: 'Ett fel uppstod',
                        text: 'Kunde inte tilldela användaren rollen',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                }
            });

        };

        self.confirmUserDeletion = function (user) {
            console.log('Searched Users Before:', self.Users());
            $('#deletionBtn').hide();
            $('#confirmDeletionBtn').show();
            $('#denyDeletionBtn').show();
        };

        self.denyUserDeletion = function (user) {
            $('#deletionBtn').show();
            $('#confirmDeletionBtn').hide();
            $('#denyDeletionBtn').hide();
        };
        //#7865
        self.createUserCase = function (user) {
            console.log("CaseId::", self.CaseSelected().CaseId);
            console.log("UserId::", ko.mapping.toJS(user).UserId);
            console.log("Role (Array)::", self.SelectedRoles());
            //We have what we need to create a UserCase
            //Write a UserCase controller or what?
        };

        self.deleteUser = function (user) {
            console.log('Deleting user', user.UserId());
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users/' + user.UserId(),
                type: 'DELETE',
                data: user,
                success: function (user) {
                    console.log('Deleted', user);
                    $.growl({
                        title: 'Raderad',
                        text: 'Användaren har raderats',
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                    var match = ko.utils.arrayFirst(self.Users(),
                        function (item) {
                            return item.UserId() == user.UserId;
                        });
                    if (match) {
                        self.Users.remove(ko.mapping.fromJS(user));
                        $('#modal-user-card').modal('hide');
                        $('#searchBtn').trigger('click');
                    }
                },
                error: function () {
                    $.growl({
                        title: 'Ett fel uppstod',
                        text: 'Kunde inte radera användaren',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                }
            });
        };

        //#7868
        self.loadCases = function () {
            return sbufHelpers.loadObservable('/Cases/CasesAndApplications', self.Cases);
        };
        self.loadAllRoles = function () {
            return self.AllRoles;
        };

        self.loadSelectedRoles = function () {
            return self.SelectedRoles;
        };

        // TEST
        self.loadCaseSelected = function (data, evt) {
            if (evt !== undefined && evt.val !== undefined) {
                sbufHelpers.loadObservable('/Cases/' + evt.val, self.CaseSelected);
            }
        };

        self.loadCategories = function () {
            return sbufHelpers.loadObservable('/Categories', self.Categories);
        };
        self.loadTags = function () {
            return sbufHelpers.loadObservable('/Tags', self.Tags);
        };
        self.loadRoles = function () {
            return sbufHelpers.loadObservable('/Roles', self.Roles);
        };
        self.loadCommittees = function () {
            return sbufHelpers.loadObservable('/Committees', self.Committees);
        };
        self.searchUsers = function () {
            var button = $(event.target);
            button.addClass('animated');
            var query = ko.mapping.toJS(self.Query);
            console.log('Querying users', query);
            self.Users([]);
            self.Users.isLoaded(false);
            self.Users.isLoading(true);
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users/Search?$orderby=Name',
                type: 'POST',
                data: ko.mapping.toJS(self.Query),
                success: function (data) {
                    self.SelectedUserIds([]);
                    //console.log('Got searchUsers', data);
                    self.Users(ko.mapping.fromJS(data)());
                    self.Users.isLoading(false);
                    self.Users.isLoaded(true);
                    button.removeClass('animated');
                    $(document).trigger('ko.viewModel.updated', self.Users);
                },
                error: function () {
                    button.removeClass('animated');
                    console.error('Error in query', query);
                }
            });
        };

        self.clearQuery = function () {
            self.IsAdministrator(false);
            self.SelectedRoleFilter(null);
            self.Query({
                FreeText: ko.observable(''),
                IsAdministrator: self.IsAdministrator,
                Roles: ko.observableArray([]),
                Tags: ko.observableArray([]),
                Categories: ko.observableArray([]),
                Committees: ko.observableArray([]),
                Name: ko.observable(''),
                Company: ko.observable(''),
                RolesFilter: self.SelectedRoleFilter,

                Email: ko.observable('')
            });
        };
        self.clearInput = function () {
            $("#searchTxt").val("");
        };

        self.createTag = function (name) {
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Tags',
                type: 'POST',
                data: { Name: name },
                success: function (tag) {
                    $.growl({
                        title: 'Skapad',
                        text: 'Etiketten har skapats',
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                    self.Tags.push(tag);
                    if (self.User()) {
                        self.User().Tags.push(tag);
                    } else {
                        self.TagsForSelectedUsers.push(tag.Name);
                    }
                },
                error: function () {
                    $.growl({
                        title: 'Ej skapad',
                        text: 'Kunde inte skapa etiketten.',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                }
            });
        };
        self.sendUserCredentials = function (user) {
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users/' + user.UserId() + '/SendCredentials',
                type: 'POST',
                success: function () {
                    $.growl({
                        title: 'Skickat',
                        text: 'Uppgifterna har skickats',
                        type: 'inverse',
                        delay: 3000,
                        'class': 'growl-item'
                    });
                },
                error: function () {
                    $.growl({
                        title: 'Ej skickat',
                        text: 'Uppgifterna kunde inte skickas',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                }
            });
        };

        self.exportSelectedUsersToNewsletter = function () {


            var contacts = ko.utils.arrayMap(self.SelectedUserIds(),
                function (id) {
                    var user = ko.mapping.toJS(ko.utils.arrayFirst(self
                        .Users(),
                        function (user) { return user.UserId() == id; }));
                    var names = " ";
                    if (user.Name !== undefined && user.Name !== "") {
                        names = user.Name.split(' ', 2);
                    }
                    var firstName = names[0];
                    var lastName = names.length > 1 ? names[1] : '';
                    return {
                        FirstName: firstName,
                        LastName: lastName,
                        Email: user.Email,
                        IsActive: true,
                        IsSmsActive: true
                    };
                });
            console.log('Contacts', contacts);

            $.ajax({
                url: '/Export/MailDirect',
                type: 'POST',
                dataType: 'json',
                data: { '': contacts },
                async: true,
                beforeSend: function () {
                    // Start loader
                    $("#loader").show();
                },
                success: function (result) {
                    // status
                    console.log('Contacts', result);
                    issue = $.parseJSON(result.Issue);
                    list = $.parseJSON(result.List);

                    $.ajax({
                        url: sbufConfig.settings.mailDirect.apiHost + '/Issues/' + issue.IssueId + '/Lists',
                        type: 'POST',
                        headers: { 'Authorization': result.Token },
                        crossDomain: true,
                        data: { '': [list] },
                        async: false,
                        success: function (issueResult) {
                            // status
                            console.log('List added', result);
                            console.log('Opening in MailDirect');
                            window.open(sbufConfig.settings.mailDirect.host + '/Issues/' + issue.IssueId);
                        },
                        error: function (issueResult) {
                            $.growl({
                                title: 'Fel',
                                text: 'Kunde inte lägga till listan utskicket i MailDirect.',
                                type: 'error',
                                delay: 0,
                                'class': 'growl-item'
                            });
                        },
                        complete: function () {
                            // Kill loader
                            setTimeout(function () {
                                $("#loader").hide();
                            },
                                250);
                        }
                    });
                },
                error: function () {
                    $.growl({
                        title: 'Fel',
                        text: 'Kunde ej exportera kontakterna till MailDirect.',
                        type: 'error',
                        delay: 0,
                        'class': 'growl-item'
                    });
                    $("#loader").hide();
                }
            });

        };

        self.SelectAllUsers = ko.computed({
            read: function () {
                return self.SelectedUserIds().length === self.Users().length;
            },
            write: function (newVal) {
                if (newVal) {
                    self.SelectedUserIds(ko.utils.arrayMap(self.Users(), function (user) { return user.UserId(); }));
                } else {
                    self.SelectedUserIds([]);
                }
            }
        });
        self.exportSelectedUsersToFile = function () {

            var users = ko.utils.arrayMap(self.SelectedUserIds(),
                function (id) {
                    var user = ko.mapping.toJS(ko.utils.arrayFirst(self.Users(),
                        function (user) { return user.UserId() === id; }));
                    var UCases = user.UserCases;
                    var caseNames = [];
                    _.each(UCases,
                        function (ucase) {

                            var userCase = _.find(self.Cases(),
                                function (c) {
                                    return ucase.CaseId === c.CaseId;
                                });

                            if (userCase !== undefined) {
                                caseNames.push(userCase.Title);
                            }

                        });

                    user.UserCases = caseNames;
                    user.Tags = ko.utils.arrayMap(user.Tags, function (item) { return item.Name; }).join(', ');
                    user.Roles = ko.utils.arrayMap(user.Roles, function (item) { return item.Name; }).join(', ');
                    user.Categories = ko.utils.arrayMap(user.Categories, function (item) { return item.Name; })
                        .join(', ');
                    user.Committees = ko.utils.arrayMap(user.Committees, function (item) { return item.Name; })
                        .join(', ');

                    var xhr = $.ajax({
                        url: sbufConfig.settings.apiHost + "/MailReceiver/" + id,
                        async: false,
                        type: "GET",
                    });

                    user.NumberOfPostalMailings = "";

                    if (xhr.status == 200) {
                        var result = JSON.parse(xhr.responseText);

                        if (result.NumberOfCopies > 0)
                            user.NumberOfPostalMailings = result.NumberOfCopies.toString();
                    }

                    return user;
                });

            var csv = jsonToCsv(users, true, true, ',');
            console.log('csv', csv);
            var filename = 'urval.csv';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };

        self.init = function () {

            utils.initTinyGrowl();
            utils.initTooltips();

            self.loadTags();
            self.loadCategories();
            self.loadCommittees();
            self.loadRoles();
            self.loadCases();
            self.loadUser();
            //viewModel.loadSelectedCase();
            self.loadCaseSelected();
            self.loadAllRoles();
            self.loadSelectedRoles();
        };


    };

    return new usersViewModel();
});