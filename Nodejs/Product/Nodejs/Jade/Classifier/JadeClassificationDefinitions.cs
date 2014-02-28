﻿/* ****************************************************************************
 *
 * Copyright (c) Microsoft Corporation. 
 *
 * This source code is subject to terms and conditions of the Apache License, Version 2.0. A 
 * copy of the license can be found in the License.html file at the root of this distribution. If 
 * you cannot locate the Apache License, Version 2.0, please send an email to 
 * vspython@microsoft.com. By using this source code in any fashion, you are agreeing to be bound 
 * by the terms of the Apache License, Version 2.0.
 *
 * You must not remove this notice, or any other, from this software.
 *
 * ***************************************************************************/

using System.ComponentModel.Composition;
using System.Windows.Media;
using Microsoft.VisualStudio.Text.Classification;
using Microsoft.VisualStudio.Utilities;

namespace Microsoft.NodejsTools.Jade {
    /// <summary>
    /// JScript Classification definitions
    /// </summary>
    internal class JadeClassificationDefinitions {
        #region JadeKeyword
        [Export(typeof(ClassificationTypeDefinition))]
        [Name(JadeClassificationTypes.Keyword), Export]
        internal ClassificationTypeDefinition KeywordClassificationType {
            get;
            set;
        }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = JadeClassificationTypes.Keyword)]
        [Name("JadeKeywordFormatDefinition")]
        [Order]
        internal sealed class KeywordClassificationFormat : ClassificationFormatDefinition {
            internal KeywordClassificationFormat() {
                ForegroundColor = Colors.OrangeRed;
                this.DisplayName = "Jade Keyword";
            }
        }
        #endregion


        #region JadeFilter
        [Export(typeof(ClassificationTypeDefinition))]
        [Name(JadeClassificationTypes.Filter), Export]
        internal ClassificationTypeDefinition FilterClassificationType {
            get;
            set;
        }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = JadeClassificationTypes.Filter)]
        [Name("JadeFilterFormatDefinition")]
        [Order]
        internal sealed class FilterClassificationFormat : ClassificationFormatDefinition {
            internal FilterClassificationFormat() {
                ForegroundColor = Colors.DarkRed;
                this.DisplayName = "Jade Filter";
            }
        }
        #endregion

        #region JadeClassLiteral

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(JadeClassificationTypes.ClassLiteral), Export]
        internal ClassificationTypeDefinition ClassLiteralClassificationType {
            get;
            set;
        }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = JadeClassificationTypes.ClassLiteral)]
        [Name("JadeClassLiteralFormatDefinition")]
        [Order]
        internal sealed class ClassLiteralClassificationFormat : ClassificationFormatDefinition {
            internal ClassLiteralClassificationFormat() {
                ForegroundColor = new Color() { R = 255, G = 128, B = 0 };
                this.DisplayName = "Jade Class Literal";
            }
        }

        #endregion

        #region JadeIdLiteral

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(JadeClassificationTypes.IdLiteral), Export]
        internal ClassificationTypeDefinition IdLiteralClassificationType {
            get;
            set;
        }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = JadeClassificationTypes.IdLiteral)]
        [Name("JadeIdLiteralFormatDefinition")]
        [Order]
        internal sealed class IdLiteralClassificationFormat : ClassificationFormatDefinition {
            internal IdLiteralClassificationFormat() {
                ForegroundColor = Colors.Maroon;
                this.DisplayName = "Jade Id Literal";
            }
        }

        #endregion

        #region JadeVariable
        [Export(typeof(ClassificationTypeDefinition))]
        [Name(JadeClassificationTypes.Variable), Export]
        internal ClassificationTypeDefinition VariableClassificationType {
            get;
            set;
        }

        [Export(typeof(EditorFormatDefinition))]
        [UserVisible(true)]
        [ClassificationType(ClassificationTypeNames = JadeClassificationTypes.Variable)]
        [Name("JadeVariableFormatDefinition")]
        [Order]
        internal sealed class VariableClassificationFormat : ClassificationFormatDefinition {
            internal VariableClassificationFormat() {
                ForegroundColor = Colors.Blue;
                this.DisplayName = "Jade Variable";
            }
        }
        #endregion
    }
}
