IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;


BEGIN TRANSACTION;
CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Nombres] nvarchar(max) NOT NULL,
    [Apellidos] nvarchar(max) NOT NULL,
    [Username] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [DateAdded] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260606063307_AddUserTable', N'10.0.8');

COMMIT;


BEGIN TRANSACTION;
CREATE TABLE [Clients] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    [DateAdded] datetime2 NOT NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);

CREATE TABLE [CompanyConfigs] (
    [Id] int NOT NULL IDENTITY,
    [CompanyName] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [TaxPercentage] decimal(18,2) NOT NULL,
    [CurrencySymbol] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [City] nvarchar(max) NOT NULL,
    [Region] nvarchar(max) NOT NULL,
    [PostalCode] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_CompanyConfigs] PRIMARY KEY ([Id])
);

CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY,
    [Code] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [IsActive] bit NOT NULL,
    [DateAdded] datetime2 NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260606064152_AddProductAndConfigTables', N'10.0.8');

COMMIT;


BEGIN TRANSACTION;
CREATE TABLE [Invoices] (
    [Id] int NOT NULL IDENTITY,
    [InvoiceNumber] nvarchar(max) NOT NULL,
    [Date] datetime2 NOT NULL,
    [ClientId] int NOT NULL,
    [SellerId] int NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [Total] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Invoices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Invoices_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Invoices_Users_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [InvoiceDetails] (
    [Id] int NOT NULL IDENTITY,
    [InvoiceId] int NOT NULL,
    [ProductId] int NULL,
    [Description] nvarchar(max) NOT NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(18,2) NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_InvoiceDetails] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_InvoiceDetails_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_InvoiceDetails_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id])
);

CREATE INDEX [IX_InvoiceDetails_InvoiceId] ON [InvoiceDetails] ([InvoiceId]);

CREATE INDEX [IX_InvoiceDetails_ProductId] ON [InvoiceDetails] ([ProductId]);

CREATE INDEX [IX_Invoices_ClientId] ON [Invoices] ([ClientId]);

CREATE INDEX [IX_Invoices_SellerId] ON [Invoices] ([SellerId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260606065123_AgregarFacturasYDetalles', N'10.0.8');

COMMIT;


BEGIN TRANSACTION;
ALTER TABLE [Invoices] ADD [PaymentMethod] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Invoices] ADD [Subtotal] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [Invoices] ADD [Tax] decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE [InvoiceDetails] ADD [ProductCode] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260606065408_AgregarCamposFacturas', N'10.0.8');

COMMIT;


BEGIN TRANSACTION;
ALTER TABLE [CompanyConfigs] ADD [Ruc] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260607023300_AgregarRucAConfiguracionEmpresa', N'10.0.8');

COMMIT;


BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompanyConfigs]') AND [c].[name] = N'Ruc');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [CompanyConfigs] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [CompanyConfigs] DROP COLUMN [Ruc];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260607031039_QuitarRucDeConfiguracionEmpresa', N'10.0.8');

COMMIT;


